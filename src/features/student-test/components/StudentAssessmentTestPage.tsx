"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./student-test.module.scss";
import { AssessmentSubmittedLogoutScreen } from "./AssessmentSubmittedLogoutScreen";
import { AssessmentUnavailableScreen } from "./AssessmentUnavailableScreen";
import { AssessmentFooter } from "./AssessmentFooter";
import { AssessmentHeader } from "./AssessmentHeader";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { MobileQuestionDrawer } from "./MobileQuestionDrawer";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { QuestionNavigator } from "./QuestionNavigator";
import { StartAssessmentScreen } from "./StartAssessmentScreen";
import { SubmitConfirmationModal } from "./SubmitConfirmationModal";
import { useToast } from "@/shared/components/toast/toast-provider";
import { useAssessment } from "../hooks/useAssessment";
import { useAssessmentAvailability } from "../hooks/useAssessmentAvailability";
import { useAssessmentTimer } from "../hooks/useAssessmentTimer";
import { useAutoSaveAssessment } from "../hooks/useAutoSaveAssessment";
import { useSubmitAssessment } from "../hooks/useSubmitAssessment";
import type { StudentAnswer } from "../types/assessment.types";
import { getAnswerForQuestion, getAssessmentSummary } from "../utils/assessmentStatus";

function answersStorageKey(assessmentId: string) {
  return `lat-assessment-answers:${assessmentId}`;
}

function timerStorageKey(assessmentId: string) {
  return `lat-assessment-end-at:${assessmentId}`;
}

export function StudentAssessmentTestPage({ assessmentId }: { assessmentId: string }) {
  const { showToast } = useToast();
  const availabilityQuery = useAssessmentAvailability();
  const assessmentQuery = useAssessment(Boolean(availabilityQuery.data?.isAvailable));
  const submitMutation = useSubmitAssessment();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedAnswers = window.localStorage.getItem(answersStorageKey(assessmentId));
    return savedAnswers ? (JSON.parse(savedAnswers) as StudentAnswer[]) : [];
  });
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const assessment = assessmentQuery.data;
  const questions = assessment?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? getAnswerForQuestion(answers, currentQuestion.id)
    : undefined;
  const summary = useMemo(
    () => getAssessmentSummary(answers, questions.length),
    [answers, questions.length]
  );

  useEffect(() => {
    window.localStorage.setItem(answersStorageKey(assessmentId), JSON.stringify(answers));
  }, [answers, assessmentId]);

  const submitAssessment = useCallback(async () => {
    if (!assessment || hasSubmitted) {
      return;
    }

    setHasSubmitted(true);

    try {
      await submitMutation.mutateAsync({
        attemptId: assessment.attemptId,
        payload: { assessmentId: assessment.id, answers }
      });
      window.localStorage.removeItem(answersStorageKey(assessmentId));
      window.localStorage.removeItem(timerStorageKey(assessmentId));
      setIsSubmittedSuccessfully(true);
    } catch {
      setHasSubmitted(false);
      showToast({ title: "Unable to submit assessment", variant: "error" });
    }
  }, [answers, assessment, assessmentId, hasSubmitted, showToast, submitMutation]);

  const { formattedTime, isWarning } = useAssessmentTimer({
    durationMinutes: assessment?.durationMinutes ?? 45,
    storageKey: assessment && hasStarted ? timerStorageKey(assessment.id) : "",
    onExpire: () => {
      void submitAssessment();
    }
  });

  const { lastSavedAt, hasSaveError } = useAutoSaveAssessment({
    attemptId: assessment?.attemptId,
    answers,
    enabled: Boolean(assessment && hasStarted && !hasSubmitted)
  });

  const upsertAnswer = (questionId: string, update: Partial<StudentAnswer>) => {
    setAnswers((current) => {
      const existing = current.find((answer) => answer.questionId === questionId);

      if (existing) {
        return current.map((answer) =>
          answer.questionId === questionId ? { ...answer, ...update } : answer
        );
      }

      return [...current, { questionId, isMarkedForReview: false, ...update }];
    });
  };

  if (availabilityQuery.isLoading || assessmentQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (availabilityQuery.isError || !availabilityQuery.data?.isAvailable) {
    return <AssessmentUnavailableScreen />;
  }

  if (assessmentQuery.isError) {
    return (
      <EmptyState message="Unable to load this assessment. Please check your network and try again." />
    );
  }

  if (!assessment || questions.length === 0 || !currentQuestion) {
    return <EmptyState />;
  }

  if (isSubmittedSuccessfully) {
    return <AssessmentSubmittedLogoutScreen />;
  }

  if (!hasStarted) {
    return <StartAssessmentScreen assessment={assessment} onStart={() => setHasStarted(true)} />;
  }

  return (
    <section className={styles.page}>
      <AssessmentHeader
        assessment={assessment}
        formattedTime={formattedTime}
        isWarning={isWarning}
        onEndTest={() => setIsSubmitModalOpen(true)}
      />
      <div className={styles.layout}>
        <main className={styles.mainPanel}>
          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
            answered={summary.answered}
          />
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            answer={currentAnswer}
            onSelectOption={(optionId) =>
              upsertAnswer(currentQuestion.id, {
                selectedOptionId: optionId
              })
            }
            onToggleReview={() =>
              upsertAnswer(currentQuestion.id, {
                isMarkedForReview: !currentAnswer?.isMarkedForReview
              })
            }
          />
          <p className={styles.muted} role={hasSaveError ? "alert" : "status"}>
            {hasSaveError
              ? "Auto-save failed. Your answers remain on this device and will retry shortly."
              : lastSavedAt
                ? `Auto-saved at ${lastSavedAt.toLocaleTimeString()}`
                : "Auto-save runs every 10 seconds."}
          </p>
          <AssessmentFooter
            isFirstQuestion={currentIndex === 0}
            isLastQuestion={currentIndex === questions.length - 1}
            onPrevious={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            onClear={() =>
              upsertAnswer(currentQuestion.id, {
                selectedOptionId: undefined
              })
            }
            onNext={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
            onSubmit={() => setIsSubmitModalOpen(true)}
            onOpenNavigator={() => setIsNavigatorOpen(true)}
          />
        </main>
        <QuestionNavigator
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onJump={setCurrentIndex}
        />
      </div>
      <MobileQuestionDrawer
        isOpen={isNavigatorOpen}
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        onClose={() => setIsNavigatorOpen(false)}
        onJump={setCurrentIndex}
      />
      {isSubmitModalOpen ? (
        <SubmitConfirmationModal
          summary={summary}
          isSubmitting={submitMutation.isPending || hasSubmitted}
          onCancel={() => setIsSubmitModalOpen(false)}
          onSubmit={() => void submitAssessment()}
        />
      ) : null}
    </section>
  );
}
