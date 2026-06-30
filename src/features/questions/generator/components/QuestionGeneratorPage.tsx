"use client";

import { useCallback, useState } from "react";
import { EmptyState } from "./EmptyState";
import { GenerationLoader } from "./GenerationLoader";
import { QuestionGeneratorForm } from "./QuestionGeneratorForm";
import { QuestionPreviewCard } from "./QuestionPreviewCard";
import { QuestionSkeleton } from "./QuestionSkeleton";
import { QuestionToolbar } from "./QuestionToolbar";
import styles from "./question-generator.module.scss";
import { useGenerateQuestions } from "../hooks/useGenerateQuestions";
import { useQuestionGeneratorOptions } from "../hooks/useQuestionGeneratorOptions";
import { useRegenerateQuestion } from "../hooks/useRegenerateQuestion";
import { useSaveAiGeneratedQuestions } from "../hooks/useSaveAiGeneratedQuestions";
import type {
  GeneratedQuestion,
  QuestionGenerationFormValues
} from "../types/question-generator.types";

function toNumericId(value: string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function QuestionGeneratorPage() {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [selectedValues, setSelectedValues] = useState<Partial<QuestionGenerationFormValues>>({});
  const [lastContext, setLastContext] = useState<QuestionGenerationFormValues | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const options = useQuestionGeneratorOptions(selectedValues);
  const generateQuestions = useGenerateQuestions();
  const regenerateQuestion = useRegenerateQuestion();
  const saveAiGeneratedQuestions = useSaveAiGeneratedQuestions();
  const isGenerating = generateQuestions.isPending;
  const areAllQuestionsReady =
    Boolean(lastContext) && questions.length >= (lastContext?.totalQuestions ?? 0);
  const approvedQuestions = questions.filter((question) => question.approvalStatus === "approved");
  const hasOptionError =
    options.grades.isError ||
    options.subjects.isError ||
    options.competencies.isError ||
    options.learningOutcomes.isError;

  const handleSelectionChange = useCallback((values: Partial<QuestionGenerationFormValues>) => {
    setSelectedValues(values);
  }, []);

  async function handleGenerate(values: QuestionGenerationFormValues) {
    setLastContext(values);
    const generatedQuestions = await generateQuestions.mutateAsync(values);
    setQuestions(generatedQuestions);
  }

  async function handleRegenerate(questionId: string) {
    if (!lastContext) {
      return;
    }

    setRegeneratingId(questionId);
    try {
      const regeneratedQuestion = await regenerateQuestion.mutateAsync({
        questionId,
        context: lastContext
      });
      setQuestions((current) =>
        current.map((question) =>
          question.id === questionId && regeneratedQuestion
            ? { ...regeneratedQuestion, approvalStatus: "pending" }
            : question
        )
      );
    } finally {
      setRegeneratingId(null);
    }
  }

  async function handleCreateAssessment() {
    if (!lastContext || !areAllQuestionsReady) {
      return;
    }

    if (approvedQuestions.length === 0) {
      return;
    }

    await saveAiGeneratedQuestions.mutateAsync({
      assessmentId: 0,
      questions: approvedQuestions.map((question) => {
        const answerKey = question.answer.trim().charAt(0).toUpperCase();

        return {
          subjectId: toNumericId(lastContext.subjectId),
          competencyId: toNumericId(lastContext.competencyId),
          learningOutcome: question.learningOutcome || lastContext.learningOutcomeId,
          questionText: question.question,
          description: [question.instruction, question.stimulus, question.rationale]
            .filter(Boolean)
            .join("\n\n"),
          difficulty: question.difficulty,
          options: question.options.map((option, index) => ({
            optionText: option.text || option.key,
            isCorrect: option.key === answerKey,
            priority: index
          }))
        };
      })
    });
  }

  function handleDuplicate(question: GeneratedQuestion) {
    setQuestions((current) => [
      ...current,
      {
        ...question,
        id: crypto.randomUUID(),
        approvalStatus: "pending"
      }
    ]);
  }

  function updateQuestionApproval(
    questionId: string,
    approvalStatus: GeneratedQuestion["approvalStatus"]
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, approvalStatus } : question
      )
    );
  }

  return (
    <section className={styles.pageShell}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Question Authoring</p>
          <h1>AI Question Generator</h1>
          <p>
            Generate, edit, and submit competency-aligned MCQs from the LAT curriculum structure.
          </p>
        </div>
        <div className={styles.headerStats} aria-label="Question generator status">
          <span>
            <strong>{questions.length}</strong>
            Generated
          </span>
          <span>
            <strong>{approvedQuestions.length}</strong>
            Approved
          </span>
          <span>
            <strong>{lastContext ? lastContext.totalQuestions : 0}</strong>
            Requested
          </span>
          <span>
            <strong>{isGenerating ? "Live" : "Ready"}</strong>
            Status
          </span>
        </div>
      </header>

      <div className={styles.page}>
        <QuestionGeneratorForm
          isGenerating={isGenerating}
          grades={options.grades.data ?? []}
          subjects={options.subjects.data ?? []}
          competencies={options.competencies.data ?? []}
          learningOutcomes={options.learningOutcomes.data ?? []}
          onSelectionChange={handleSelectionChange}
          onGenerate={handleGenerate}
        />

        <div className={styles.previewColumn}>
          {hasOptionError ? (
            <section className={styles.emptyState} role="alert">
              <div>
                <h2>Unable to load curriculum options</h2>
                <p>Please retry after confirming the curriculum APIs are available.</p>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={() => options.grades.refetch()}
                >
                  Retry
                </button>
              </div>
            </section>
          ) : null}

          {isGenerating ? (
            <>
              <GenerationLoader />
              <QuestionSkeleton />
              <QuestionSkeleton />
            </>
          ) : null}

          {!isGenerating && questions.length === 0 ? <EmptyState /> : null}

          {!isGenerating && questions.length > 0 ? (
            <>
              {areAllQuestionsReady ? (
                <QuestionToolbar
                  count={questions.length}
                  approvedCount={approvedQuestions.length}
                  isCreatingAssessment={saveAiGeneratedQuestions.isPending}
                  onCreateAssessment={handleCreateAssessment}
                />
              ) : null}
              {questions.map((question, index) => (
                <QuestionPreviewCard
                  index={index}
                  question={question}
                  key={question.id}
                  isRegenerating={regeneratingId === question.id}
                  onUpdate={(updatedQuestion) =>
                    setQuestions((current) =>
                      current.map((item) =>
                        item.id === updatedQuestion.id ? updatedQuestion : item
                      )
                    )
                  }
                  onDuplicate={handleDuplicate}
                  onApprove={(id) => updateQuestionApproval(id, "approved")}
                  onReject={(id) => void handleRegenerate(id)}
                  onDelete={(id) =>
                    setQuestions((current) => current.filter((item) => item.id !== id))
                  }
                  onRegenerate={handleRegenerate}
                />
              ))}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
