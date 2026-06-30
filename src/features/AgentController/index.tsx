"use client";

import { SUBJECT_DISTRIBUTION, SUBJECT_LANGUAGE } from "@/shared/lib/lat/config";

import { useEffect, useMemo, useRef, useState } from "react";

import { readAuthToken } from "@/features/auth/utils/auth-cookies";
import {
  AgentLog,
  AgentState,
  GenerateResponse,
  Question,
  RagIngestResponse
} from "@/shared/types/lat";

import { getGradeInfo, runLATAgent } from "@/shared/lib/lat/agent";

const GRADES = ["3", "6", "8"] as const;
const WAITING_LOG: AgentLog = {
  timestamp: 0,
  type: "info",
  message: "Waiting to start."
};
const CREATE_ASSESSMENT_URL = "https://faq-admin.projectinclusion.in/api/LAT/create-assessment";
const SAVE_AI_GENERATED_QUESTIONS_URL =
  "https://faq-admin.projectinclusion.in/api/LAT/save-ai-generated-questions";
type QuestionApprovalStatus = "pending" | "approved" | "rejected";

type ValidationResponse = {
  results: Array<{
    id: number;
    valid: boolean;
    score: number;
    issues: string[];
    fix: string | null;
  }>;
};

function formatTime(timestamp: number): string {
  if (timestamp === 0) {
    return "--:--:--";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(timestamp);
}

function formatDuration(start: number, end: number): string {
  const elapsed = Math.max(0, end - start);
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest}s`;
}

function statusClasses(status: AgentState["status"]): string {
  const classes: Record<AgentState["status"], string> = {
    idle: "bg-zinc-200 text-zinc-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700"
  };
  return classes[status];
}

function logClasses(type: AgentLog["type"]): string {
  const classes: Record<AgentLog["type"], string> = {
    info: "text-zinc-600",
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-amber-700",
    validate: "text-blue-700"
  };
  return classes[type];
}

function difficultyClasses(difficulty: Question["difficulty"]): string {
  const classes: Record<Question["difficulty"], string> = {
    basic: "bg-green-100 text-green-700 border-green-200",
    proficient: "bg-blue-100 text-blue-700 border-blue-200",
    advanced: "bg-amber-100 text-amber-800 border-amber-200"
  };
  return classes[difficulty];
}

function answerLetter(answer: string): string {
  return answer.trim().charAt(0).toUpperCase();
}

function normalizeOptionText(option: string): string {
  return option.replace(/^[A-D][).]\s*/i, "").trim() || option;
}

function isCorrectOption(option: string, correctAnswer: string): boolean {
  return new RegExp(`^${correctAnswer}[).]\\s*`, "i").test(option.trim());
}

function toNumericId(value: string | number | undefined) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function extractAssessmentId(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return 0;
  }

  const record = payload as {
    id?: unknown;
    assessmentId?: unknown;
    response?: unknown;
  };

  if (typeof record.id === "number") {
    return record.id;
  }

  if (typeof record.assessmentId === "number") {
    return record.assessmentId;
  }

  if (record.response && typeof record.response === "object") {
    return extractAssessmentId(record.response);
  }

  return 0;
}

function questionKey(question: Question, index: number) {
  return `${question.subject}-${question.id}-${index}`;
}

function approvalClasses(status: QuestionApprovalStatus) {
  const classes: Record<QuestionApprovalStatus, string> = {
    pending: "bg-zinc-100 text-zinc-700 border-zinc-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200"
  };

  return classes[status];
}

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : "Request failed";
    throw new Error(message);
  }

  return payload as TResponse;
}

export default function AgentController() {
  const [selectedGrade, setSelectedGrade] = useState<string>("6");
  const [state, setState] = useState<AgentState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [ragTitle, setRagTitle] = useState("LAT guidance");
  const [ragSource, setRagSource] = useState("manual");
  const [ragText, setRagText] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [ragMessage, setRagMessage] = useState<string | null>(null);
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const [assessmentMessage, setAssessmentMessage] = useState<string | null>(null);
  const [approvalByQuestionKey, setApprovalByQuestionKey] = useState<
    Record<string, QuestionApprovalStatus>
  >({});
  const [replacingQuestionKey, setReplacingQuestionKey] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  const gradeInfo = useMemo(() => getGradeInfo(selectedGrade), [selectedGrade]);
  const subjects = useMemo(
    () => Object.keys(SUBJECT_DISTRIBUTION[selectedGrade as keyof typeof SUBJECT_DISTRIBUTION]),
    [selectedGrade]
  );

  const completedSubjects = state ? Object.keys(state.completed).length : 0;
  const failedSubjects = state ? Object.keys(state.failed).length : 0;
  const totalSubjects = subjects.length;
  const progress =
    totalSubjects > 0 ? ((completedSubjects + failedSubjects) / totalSubjects) * 100 : 0;
  const visibleStatus = state?.status ?? "idle";
  const approvedQuestions = useMemo(
    () =>
      (state?.allQuestions ?? []).filter(
        (question, index) => approvalByQuestionKey[questionKey(question, index)] === "approved"
      ),
    [approvalByQuestionKey, state?.allQuestions]
  );
  const rejectedQuestionCount = useMemo(
    () =>
      (state?.allQuestions ?? []).filter(
        (question, index) => approvalByQuestionKey[questionKey(question, index)] === "rejected"
      ).length,
    [approvalByQuestionKey, state?.allQuestions]
  );
  const pendingQuestionCount = Math.max(
    0,
    (state?.allQuestions.length ?? 0) - approvedQuestions.length - rejectedQuestionCount
  );

  const difficultyCounts = useMemo(() => {
    const counts: Record<Question["difficulty"], number> = { basic: 0, proficient: 0, advanced: 0 };

    for (const question of state?.allQuestions ?? []) {
      counts[question.difficulty] += 1;
    }

    return counts;
  }, [state?.allQuestions]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state?.logs]);

  async function startAgent(): Promise<void> {
    setIsRunning(true);
    setApprovalByQuestionKey({});
    setReplacingQuestionKey(null);
    setAssessmentMessage(null);

    try {
      await runLATAgent(selectedGrade, setState);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Agent failed";
      setState((current) => {
        const now = Date.now();
        const fallback: AgentState = current ?? {
          sessionId: now.toString(),
          grade: selectedGrade,
          assessmentGrade: "",
          goal: `Generate LAT baseline assessment for Grade ${selectedGrade}`,
          status: "failed",
          completed: {},
          remaining: {},
          failed: {},
          retryCount: {},
          ragContexts: {},
          allQuestions: [],
          logs: [],
          startTime: now,
          endTime: now
        };

        return {
          ...fallback,
          status: "failed",
          endTime: now,
          logs: [...fallback.logs, { timestamp: now, type: "error", message }]
        };
      });
    } finally {
      setIsRunning(false);
    }
  }

  function resetAgent(): void {
    setState(null);
    setIsRunning(false);
    setAssessmentMessage(null);
    setApprovalByQuestionKey({});
    setReplacingQuestionKey(null);
  }

  function updateQuestionApproval(
    question: Question,
    index: number,
    approvalStatus: QuestionApprovalStatus
  ) {
    setApprovalByQuestionKey((current) => ({
      ...current,
      [questionKey(question, index)]: approvalStatus
    }));
  }

  async function replaceRejectedQuestion(question: Question, index: number) {
    if (!state) {
      return;
    }

    const key = questionKey(question, index);
    setReplacingQuestionKey(key);
    setAssessmentMessage(null);

    try {
      const generation = await postJson<GenerateResponse>("/api/generate", {
        grade: state.grade,
        subject: question.subject,
        competency: question.competency,
        count: 1,
        language: SUBJECT_LANGUAGE[question.subject as keyof typeof SUBJECT_LANGUAGE] ?? "English",
        ragContext: state.ragContexts[question.subject] ?? []
      });
      const replacement = generation.questions[0];

      if (!replacement) {
        throw new Error("Replacement question was not generated.");
      }

      const validation = await postJson<ValidationResponse>("/api/validate", {
        questions: [replacement]
      }).catch(() => null);
      const validationResult = validation?.results[0];
      const replacementQuestion: Question = {
        ...replacement,
        id: Date.now(),
        status: "pending",
        validation: validationResult
          ? {
              valid: validationResult.valid,
              score: validationResult.score,
              issues: validationResult.issues,
              fix: validationResult.fix
            }
          : replacement.validation
      };

      setState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          allQuestions: current.allQuestions.map((item, itemIndex) =>
            itemIndex === index ? replacementQuestion : item
          ),
          logs: [
            ...current.logs,
            {
              timestamp: Date.now(),
              type: "success",
              subject: question.subject,
              message: `Rejected question ${index + 1} replaced with a new question.`
            }
          ]
        };
      });
      setApprovalByQuestionKey((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Question replacement failed";
      setAssessmentMessage(message);
    } finally {
      setReplacingQuestionKey(null);
    }
  }

  async function ingestKnowledge(): Promise<void> {
    setIsIngesting(true);
    setRagMessage(null);

    try {
      const response = await fetch("/api/rag/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ragTitle,
          source: ragSource,
          text: ragText,
          grade: selectedGrade
        })
      });
      const payload = (await response.json()) as
        RagIngestResponse | { error: string; message?: string };

      if (!response.ok) {
        const message =
          "message" in payload
            ? payload.message
            : "error" in payload
              ? payload.error
              : "RAG ingest failed";
        throw new Error(message ?? "RAG ingest failed");
      }

      const ingestResponse = payload as RagIngestResponse;
      setRagMessage(
        `Indexed ${ingestResponse.chunks} chunks in Pinecone namespace "${ingestResponse.namespace}".`
      );
      setRagText("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "RAG ingest failed";
      setRagMessage(message);
    } finally {
      setIsIngesting(false);
    }
  }

  async function createAssessment(): Promise<void> {
    if (!state || state.allQuestions.length === 0) {
      setAssessmentMessage("Generate questions before creating an assessment.");
      return;
    }

    if (approvedQuestions.length === 0) {
      setAssessmentMessage("Approve at least one question before creating an assessment.");
      return;
    }

    const accessToken = readAuthToken();
    if (!accessToken) {
      setAssessmentMessage("Login token not found. Please sign in again before saving.");
      return;
    }

    setIsCreatingAssessment(true);
    setAssessmentMessage(null);

    try {
      const saveQuestionsResponse = await fetch(SAVE_AI_GENERATED_QUESTIONS_URL, {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // assessmentId: 0,
          educationStageId: 1,
          gradeId: Number(state.grade),
          questions: approvedQuestions.map((question) => {
            const correctAnswer = answerLetter(question.answer);

            return {
              subjectId: 0,
              competencyId: 0,
              learningOutcome: question.lo,
              questionText: question.question,
              description: question.competency,
              difficulty: question.difficulty,
              options: question.options.map((option, index) => ({
                optionText: normalizeOptionText(option),
                isCorrect: isCorrectOption(option, correctAnswer),
                priority: index
              }))
            };
          })
        })
      });
      const saveQuestionsPayload = (await saveQuestionsResponse.json().catch(() => null)) as {
        status?: number;
        message?: string;
        error?: string;
        response?: unknown;
      } | null;

      if (!saveQuestionsResponse.ok) {
        const message =
          saveQuestionsPayload?.message ??
          saveQuestionsPayload?.error ??
          "Assessment questions save failed";
        throw new Error(message);
      }

      const createAssessmentResponse = await fetch(CREATE_ASSESSMENT_URL, {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          assessmentName: `Grade ${state.grade} LAT Baseline Assessment`,
          description: `AI generated LAT baseline assessment for Grade ${state.grade}.`,
          educationStageId: 1,
          gradeId: toNumericId(state.grade),
          subjectId: 0,
          questionType: 1,
          totalQuestions: approvedQuestions.length,
          totalMarks: approvedQuestions.reduce((total, question) => total + question.marks, 0),
          durationMinutes: gradeInfo.duration,
          difficultyLevel: 1,
          assessmentDate: new Date().toISOString(),
          status: 1,
          createdBy: 1
        })
      });
      const createAssessmentPayload = (await createAssessmentResponse.json().catch(() => null)) as {
        status?: number;
        message?: string;
        error?: string;
        response?: unknown;
      } | null;

      if (!createAssessmentResponse.ok) {
        const message =
          createAssessmentPayload?.message ??
          createAssessmentPayload?.error ??
          "Assessment create failed";
        throw new Error(message);
      }

      const assessmentId = extractAssessmentId(createAssessmentPayload);

      setAssessmentMessage(
        `Assessment ${assessmentId || "created"} saved with ${approvedQuestions.length} questions.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Assessment save failed";
      setAssessmentMessage(message);
    } finally {
      setIsCreatingAssessment(false);
    }
  }

  function subjectStatus(subject: string): { label: string; symbol: string; className: string } {
    if (state?.completed[subject] !== undefined) {
      return {
        label: "done",
        symbol: "✓",
        className: "bg-green-100 text-green-700 border-green-200"
      };
    }

    if (state?.failed[subject] !== undefined) {
      return { label: "failed", symbol: "×", className: "bg-red-100 text-red-700 border-red-200" };
    }

    if (isRunning && state?.remaining[subject] !== undefined) {
      const lastSubject = state.logs
        .slice()
        .reverse()
        .find((log) => log.subject)?.subject;

      if (lastSubject === subject) {
        return {
          label: "generating",
          symbol: "↻",
          className: "bg-blue-100 text-blue-700 border-blue-200"
        };
      }
    }

    return {
      label: "pending",
      symbol: "…",
      className: "bg-zinc-100 text-zinc-600 border-zinc-200"
    };
  }

  return (
    <div className="space-y-6">
      <section className="border-line border-y bg-white/70 px-4 py-5 shadow-sm sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {GRADES.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  disabled={isRunning}
                  onClick={() => setSelectedGrade(grade)}
                  className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                    selectedGrade === grade
                      ? "border-ink bg-ink text-blue-700"
                      : "border-line text-ink bg-white hover:border-zinc-500"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-zinc-600">
              {gradeInfo.questions} questions | {gradeInfo.duration} minutes | {gradeInfo.subjects}{" "}
              subjects
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={startAgent}
              disabled={isRunning}
              className="bg-leaf rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunning ? "Agent Running" : "Start Agent"}
            </button>
            <button
              type="button"
              onClick={resetAgent}
              disabled={isRunning}
              className="border-line text-ink rounded-md border bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="border-line border-y bg-white/70 px-4 py-5 shadow-sm sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr_auto] lg:items-end">
          <label className="block">
            <span className="text-xs font-bold uppercase text-zinc-500">RAG Title</span>
            <input
              value={ragTitle}
              onChange={(event) => setRagTitle(event.target.value)}
              disabled={isRunning || isIngesting}
              className="border-line focus:border-lake mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-zinc-500">Source</span>
            <input
              value={ragSource}
              onChange={(event) => setRagSource(event.target.value)}
              disabled={isRunning || isIngesting}
              className="border-line focus:border-lake mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none disabled:opacity-60"
            />
          </label>
          <button
            type="button"
            onClick={ingestKnowledge}
            disabled={isRunning || isIngesting || ragText.trim().length === 0}
            className="bg-lake rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isIngesting ? "Indexing" : "Index RAG"}
          </button>
        </div>
        <textarea
          value={ragText}
          onChange={(event) => setRagText(event.target.value)}
          disabled={isRunning || isIngesting}
          rows={5}
          className="border-line focus:border-lake mt-4 w-full resize-y rounded-md border bg-white px-3 py-2 text-sm leading-6 outline-none disabled:opacity-60"
          placeholder="Paste LAT/KVS/PARAKH guidelines, learning outcomes, rubrics, or sample question notes here."
        />
        {ragMessage && <p className="mt-2 text-sm font-medium text-zinc-600">{ragMessage}</p>}
      </section>

      <section className="border-line border-y bg-white/70 px-4 py-5 shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses(visibleStatus)}`}
            >
              {visibleStatus.toUpperCase()}
            </span>
            <p className="mt-2 text-sm text-zinc-600">
              {completedSubjects + failedSubjects} / {totalSubjects} subjects processed
            </p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 sm:max-w-md">
            <div
              className="bg-lake h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const itemStatus = subjectStatus(subject);
            const retryCount = state?.retryCount[subject] ?? 0;
            return (
              <div key={subject} className="border-line bg-paper rounded-md border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-ink text-base font-bold">{subject}</h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${itemStatus.className}`}
                  >
                    <span>{itemStatus.symbol}</span>
                    {itemStatus.label}
                  </span>
                </div>
                <div className="mt-3 min-h-10 space-y-1 text-sm text-zinc-600">
                  {state?.completed[subject] !== undefined && (
                    <p>{state.completed[subject]} questions done</p>
                  )}
                  {state?.failed[subject] !== undefined && (
                    <p>{state.failed[subject]} questions skipped</p>
                  )}
                  {retryCount > 0 && <p>Retries: {retryCount}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-line border-y bg-zinc-950 px-4 py-5 shadow-sm sm:px-6">
        <div ref={logRef} className="max-h-[300px] overflow-y-auto pr-2">
          {(state?.logs.length ? state.logs : [WAITING_LOG]).map((log, index) => (
            <div
              key={`${log.timestamp}-${index}`}
              className={`flex gap-3 py-1 text-sm ${logClasses(log.type)}`}
            >
              <span className="shrink-0 text-zinc-500">{formatTime(log.timestamp)}</span>
              <span className="break-words">
                {log.subject ? `[${log.subject}] ${log.message}` : log.message}
              </span>
            </div>
          ))}
        </div>
      </section>

      {state && (state.status === "completed" || state.status === "failed") && (
        <section className="space-y-5">
          <div className="border-line grid gap-3 border-y bg-white/70 px-4 py-5 shadow-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <SummaryItem label="Total Questions" value={state.allQuestions.length.toString()} />
            <SummaryItem label="Approved" value={approvedQuestions.length.toString()} />
            <SummaryItem label="Rejected" value={rejectedQuestionCount.toString()} />
            <SummaryItem label="Pending" value={pendingQuestionCount.toString()} />
            <SummaryItem
              label="Subjects Done"
              value={Object.keys(state.completed).length.toString()}
            />
            <SummaryItem label="Failed" value={Object.keys(state.failed).length.toString()} />
            <SummaryItem
              label="Time Taken"
              value={formatDuration(state.startTime, state.endTime ?? state.startTime)}
            />
          </div>

          <div className="border-line flex flex-col gap-3 border-y bg-white/70 px-4 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Basic ({difficultyCounts.basic})
              </span>
              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                Proficient ({difficultyCounts.proficient})
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                Advanced ({difficultyCounts.advanced})
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <button
                type="button"
                onClick={createAssessment}
                disabled={isCreatingAssessment || approvedQuestions.length === 0}
                className="bg-ink rounded-md bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreatingAssessment ? "Saving Assessment" : "Create Assessment"}
              </button>
              <p className="text-sm font-medium text-zinc-600">
                {approvedQuestions.length} approved question
                {approvedQuestions.length === 1 ? "" : "s"} will be saved.
              </p>
              {assessmentMessage && (
                <p className="text-sm font-medium text-zinc-600">{assessmentMessage}</p>
              )}
            </div>
          </div>

          {Object.keys(state.ragContexts).length > 0 && (
            <div className="border-line border-y bg-white/70 px-4 py-5 shadow-sm sm:px-6">
              <h2 className="text-ink text-lg font-bold">RAG Context Used</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {Object.entries(state.ragContexts).map(([subject, contexts]) => (
                  <div key={subject} className="border-line bg-paper rounded-md border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-ink font-bold">{subject}</h3>
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">
                        {contexts.length} chunks
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {contexts.slice(0, 3).map((context) => (
                        <p key={context.id} className="line-clamp-2 text-sm text-zinc-600">
                          {context.title} ({context.score.toFixed(2)}): {context.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {state.allQuestions.map((question, index) => {
              const key = questionKey(question, index);
              const approvalStatus = approvalByQuestionKey[key] ?? "pending";
              const isReplacingQuestion = replacingQuestionKey === key;

              return (
                <article
                  key={`${question.subject}-${question.id}-${index}`}
                  className={`border-line rounded-md border bg-white p-4 shadow-sm sm:p-5 ${
                    approvalStatus === "rejected" ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-zinc-500">Q{index + 1}</span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
                      {question.subject}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${difficultyClasses(question.difficulty)}`}
                    >
                      {question.difficulty}
                    </span>
                    {question.validation && (
                      <span className="bg-ink rounded-full px-2.5 py-1 text-xs font-bold text-white">
                        Score {question.validation.score}/10
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${approvalClasses(approvalStatus)}`}
                    >
                      {approvalStatus}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={approvalStatus === "approved"}
                      onClick={() => updateQuestionApproval(question, index, "approved")}
                      className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={isReplacingQuestion}
                      onClick={() => void replaceRejectedQuestion(question, index)}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isReplacingQuestion ? "Replacing..." : "Reject & Replace"}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
                    <span className="border-line bg-paper rounded-md border px-2 py-1">
                      {question.competency}
                    </span>
                    <span className="border-line bg-paper rounded-md border px-2 py-1">
                      {question.lo}
                    </span>
                  </div>
                  <p className="text-ink mt-4 text-base font-semibold leading-7">
                    {question.question}
                  </p>
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {question.options.map((option) => {
                      const isCorrect = option
                        .trim()
                        .startsWith(`${answerLetter(question.answer)})`);
                      return (
                        <div
                          key={option}
                          className={`rounded-md border px-3 py-2 text-sm ${
                            isCorrect
                              ? "border-green-300 bg-green-50 text-green-800"
                              : "border-line bg-paper text-zinc-700"
                          }`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line bg-paper rounded-md border p-4">
      <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
      <p className="text-ink mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
