// import type { AgentLog, AgentState, GenerateResponse, Question, ValidationResult } from "@/types/lat";
// import type { RagContext, RagSearchResponse } from "@/types/lat";
import {
  AgentLog,
  AgentState,
  GenerateResponse,
  Question,
  RagContext,
  RagSearchResponse,
  ValidationResult
} from "@/shared/types/lat";
import {
  BASELINE_GRADE,
  COMPETENCIES,
  GRADE_CONFIG,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  SUBJECT_DISTRIBUTION,
  SUBJECT_LANGUAGE
} from "./config";

interface ValidationResultWithId extends ValidationResult {
  id: number;
}

interface ValidationResponse {
  results: ValidationResultWithId[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    average_score: number;
  };
}

type GradeKey = keyof typeof SUBJECT_DISTRIBUTION;
type SubjectName = keyof typeof COMPETENCIES;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function cloneState(state: AgentState): AgentState {
  return {
    ...state,
    completed: { ...state.completed },
    remaining: { ...state.remaining },
    failed: { ...state.failed },
    retryCount: { ...state.retryCount },
    ragContexts: Object.fromEntries(
      Object.entries(state.ragContexts).map(([subject, contexts]) => [
        subject,
        contexts.map((context) => ({ ...context }))
      ])
    ),
    allQuestions: state.allQuestions.map((question) => ({
      ...question,
      options: [...question.options],
      validation: question.validation
        ? { ...question.validation, issues: [...question.validation.issues] }
        : undefined
    })),
    logs: state.logs.map((log) => ({ ...log }))
  };
}

function emit(state: AgentState, onStateUpdate: (state: AgentState) => void): void {
  onStateUpdate(cloneState(state));
}

function addLog(
  state: AgentState,
  type: AgentLog["type"],
  message: string,
  subject?: string
): void {
  state.logs.push({
    timestamp: Date.now(),
    type,
    subject,
    message
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function isRateLimitError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes("rate") || message.includes("429");
}

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null
        ? JSON.stringify(payload)
        : response.statusText;
    throw new Error(detail);
  }

  return payload as TResponse;
}

async function postJsonWithRateLimitRetry<TResponse>(
  url: string,
  body: unknown,
  state: AgentState,
  subject: string,
  onStateUpdate: (state: AgentState) => void
): Promise<TResponse> {
  try {
    return await postJson<TResponse>(url, body);
  } catch (error) {
    if (isRateLimitError(error)) {
      addLog(state, "warning", "Gemini API rate limit hit. Waiting 2000ms before retry.", subject);
      emit(state, onStateUpdate);
      await sleep(2000);
      return postJson<TResponse>(url, body);
    }

    throw error;
  }
}

function subjectCompetency(subject: string): string {
  const competencies = COMPETENCIES[subject as SubjectName];
  return competencies?.[0] ?? "";
}

async function retrieveRagContext(
  grade: string,
  subject: string,
  state: AgentState,
  onStateUpdate: (state: AgentState) => void
): Promise<RagContext[]> {
  addLog(state, "info", `Retrieving RAG context for ${subject}...`, subject);
  emit(state, onStateUpdate);

  try {
    const ragSearch = await postJsonWithRateLimitRetry<RagSearchResponse>(
      "/api/rag/search",
      {
        grade,
        subject,
        competency: subjectCompetency(subject),
        topK: 4
      },
      state,
      subject,
      onStateUpdate
    );
    state.ragContexts[subject] = ragSearch.contexts;
    addLog(
      state,
      "success",
      `Retrieved ${ragSearch.contexts.length} RAG context chunks for ${subject}.`,
      subject
    );
    emit(state, onStateUpdate);
    return ragSearch.contexts;
  } catch (error) {
    state.ragContexts[subject] = [];
    addLog(
      state,
      "warning",
      `RAG retrieval skipped for ${subject}: ${getErrorMessage(error)}`,
      subject
    );
    emit(state, onStateUpdate);
    return [];
  }
}

function initialState(grade: string): AgentState {
  const gradeKey = grade as GradeKey;
  const remaining = { ...SUBJECT_DISTRIBUTION[gradeKey] };

  return {
    sessionId: Date.now().toString(),
    grade,
    assessmentGrade: BASELINE_GRADE[gradeKey],
    goal: `Generate LAT baseline assessment for Grade ${grade}`,
    status: "running",
    completed: {},
    remaining,
    failed: {},
    retryCount: {},
    ragContexts: {},
    allQuestions: [],
    logs: [{ timestamp: Date.now(), type: "info", message: `Agent started for Grade ${grade}` }],
    startTime: Date.now()
  };
}

function attachValidation(questions: Question[], validation: ValidationResponse): Question[] {
  return questions.map((question) => {
    const result = validation.results.find((item) => item.id === question.id);

    if (!result) {
      return question;
    }

    return {
      ...question,
      validation: {
        valid: result.valid,
        score: result.score,
        issues: result.issues,
        fix: result.fix
      }
    };
  });
}

async function fixInvalidQuestions(
  questions: Question[],
  state: AgentState,
  subject: string,
  onStateUpdate: (state: AgentState) => void
): Promise<Question[]> {
  const fixedQuestions: Question[] = [];

  for (const question of questions) {
    if (!question.validation || question.validation.valid) {
      fixedQuestions.push(question);
      continue;
    }

    const issues = question.validation.issues.join("; ");
    addLog(state, "warning", `Question ${question.id} failed validation: ${issues}`, subject);
    emit(state, onStateUpdate);

    if (!question.validation.fix) {
      fixedQuestions.push(question);
      continue;
    }

    try {
      const fixed = await postJsonWithRateLimitRetry<Question>(
        "/api/fix",
        { question, fix: question.validation.fix },
        state,
        subject,
        onStateUpdate
      );
      fixedQuestions.push({
        ...fixed,
        validation: {
          valid: true,
          score: question.validation.score,
          issues: [],
          fix: null
        }
      });
      addLog(state, "info", `Question ${question.id} auto-fixed`, subject);
      emit(state, onStateUpdate);
    } catch (error) {
      fixedQuestions.push(question);
      addLog(
        state,
        "error",
        `Question ${question.id} auto-fix failed: ${getErrorMessage(error)}`,
        subject
      );
      emit(state, onStateUpdate);
    }
  }

  return fixedQuestions;
}

export async function runLATAgent(
  grade: string,
  onStateUpdate: (state: AgentState) => void
): Promise<AgentState> {
  if (!(grade in SUBJECT_DISTRIBUTION)) {
    throw new Error(`Unsupported grade: ${grade}`);
  }

  const state = initialState(grade);
  emit(state, onStateUpdate);

  while (Object.keys(state.remaining).length > 0) {
    const entries = Object.entries(state.remaining);

    for (const [subject, count] of entries) {
      if (!(subject in state.remaining)) {
        continue;
      }

      addLog(state, "info", `Generating ${count} questions for ${subject}...`, subject);
      emit(state, onStateUpdate);

      try {
        const ragContext = await retrieveRagContext(grade, subject, state, onStateUpdate);

        const generation = await postJsonWithRateLimitRetry<GenerateResponse>(
          "/api/generate",
          {
            grade,
            subject,
            competency: subjectCompetency(subject),
            count,
            language: SUBJECT_LANGUAGE[subject as keyof typeof SUBJECT_LANGUAGE],
            ragContext
          },
          state,
          subject,
          onStateUpdate
        );

        addLog(state, "validate", `Validating ${count} questions for ${subject}...`, subject);
        emit(state, onStateUpdate);

        const validation = await postJsonWithRateLimitRetry<ValidationResponse>(
          "/api/validate",
          { questions: generation.questions },
          state,
          subject,
          onStateUpdate
        );

        const validatedQuestions = attachValidation(generation.questions, validation);
        const fixedQuestions = await fixInvalidQuestions(
          validatedQuestions,
          state,
          subject,
          onStateUpdate
        );

        state.allQuestions.push(...fixedQuestions);
        state.completed[subject] = fixedQuestions.length;
        delete state.remaining[subject];
        addLog(
          state,
          "success",
          `${subject} complete. ${fixedQuestions.length} questions added. Avg score: ${validation.summary.average_score}`,
          subject
        );
        emit(state, onStateUpdate);
        await sleep(RETRY_DELAY_MS);
      } catch (error) {
        const nextRetry = (state.retryCount[subject] ?? 0) + 1;
        state.retryCount[subject] = nextRetry;
        addLog(state, "warning", `Generation failed for ${subject}. Retry ${nextRetry}/3`, subject);
        emit(state, onStateUpdate);

        if (nextRetry >= MAX_RETRIES) {
          state.failed[subject] = count;
          addLog(state, "error", `${subject} failed after 3 retries. Skipping.`, subject);
          delete state.remaining[subject];
          emit(state, onStateUpdate);
        }

        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  state.status = Object.keys(state.failed).length === 0 ? "completed" : "failed";
  state.endTime = Date.now();
  addLog(
    state,
    state.status === "completed" ? "success" : "error",
    `Agent complete. ${state.allQuestions.length} questions generated. ${Object.keys(state.failed).length} subjects failed.`
  );
  emit(state, onStateUpdate);

  return state;
}

export function getGradeInfo(grade: string): {
  questions: number;
  duration: number;
  subjects: number;
} {
  const gradeKey = grade as GradeKey;
  return {
    questions: GRADE_CONFIG[gradeKey].totalQuestions,
    duration: GRADE_CONFIG[gradeKey].duration,
    subjects: Object.keys(SUBJECT_DISTRIBUTION[gradeKey]).length
  };
}
