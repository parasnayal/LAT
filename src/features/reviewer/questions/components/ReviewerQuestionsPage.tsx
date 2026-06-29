"use client";

import { useState } from "react";
import styles from "./reviewer-questions.module.scss";
import { ApproveModal } from "./ApproveModal";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { QuestionDrawer } from "./QuestionDrawer";
import { QuestionTable } from "./QuestionTable";
import { RejectModal } from "./RejectModal";
import { useToast } from "@/shared/components/toast/toast-provider";
import {
  useDuplicateReviewerQuestion,
  useReviewQuestion,
  useReviewerQuestions,
  useUpdateReviewerQuestion
} from "../hooks/useReviewerQuestions";
import type {
  EditQuestionValues,
  ReviewerQuestion,
  ReviewerQuestionFilters
} from "../types/reviewer-question.types";

const DEFAULT_FILTERS: ReviewerQuestionFilters = {
  status: "pending_review",
  page: 1,
  pageSize: 10
};

type PendingModal = "approve" | "reject" | null;

export function ReviewerQuestionsPage() {
  const [filters, setFilters] = useState<ReviewerQuestionFilters>(DEFAULT_FILTERS);
  const [selectedQuestion, setSelectedQuestion] = useState<ReviewerQuestion | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [pendingModal, setPendingModal] = useState<PendingModal>(null);
  const { showToast } = useToast();

  const questionsQuery = useReviewerQuestions(filters);
  const reviewMutation = useReviewQuestion();
  const updateMutation = useUpdateReviewerQuestion();
  const duplicateMutation = useDuplicateReviewerQuestion();

  const page = questionsQuery.data?.page ?? filters.page ?? 1;
  const pageSize = questionsQuery.data?.pageSize ?? filters.pageSize ?? 10;
  const total = questionsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const questions = questionsQuery.data?.items ?? [];

  const openQuestion = (question: ReviewerQuestion) => {
    setSelectedQuestion(question);
    setReviewComment("");
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setReviewComment("");
    setPendingModal(null);
  };

  const submitDecision = async (
    status: "approved" | "rejected" | "changes_requested",
    comment: string
  ) => {
    if (!selectedQuestion) {
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      showToast({ title: "Reviewer comment is required", variant: "error" });
      return;
    }

    await reviewMutation.mutateAsync({
      id: selectedQuestion.id,
      payload: { status, reviewerComment: trimmedComment }
    });

    closeQuestion();
  };

  const saveQuestion = async (values: EditQuestionValues) => {
    if (!selectedQuestion) {
      return;
    }

    const updatedQuestion = await updateMutation.mutateAsync({
      id: selectedQuestion.id,
      payload: values
    });
    setSelectedQuestion(updatedQuestion);
  };

  const duplicateQuestion = async () => {
    if (!selectedQuestion) {
      return;
    }

    await duplicateMutation.mutateAsync(selectedQuestion.id);
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PARAKH LAT Review Workflow</p>
          <h1 className={styles.title}>Reviewer Questions</h1>
          <p className={styles.subtitle}>
            Review AI-generated competency-based questions for Grades 3, 6, and 9 before they enter
            assessments and the question bank.
          </p>
        </div>
        <div className={styles.headerMetric} aria-label={`${total} questions matching filters`}>
          <span className={styles.metricValue}>{total}</span>
          Questions
        </div>
      </header>

      <div className={styles.panel}>
        <FilterBar filters={filters} onChange={setFilters} />

        {questionsQuery.isLoading ? <LoadingSkeleton /> : null}
        {!questionsQuery.isLoading && questions.length === 0 ? <EmptyState /> : null}
        {!questionsQuery.isLoading && questions.length > 0 ? (
          <>
            <QuestionTable questions={questions} onView={openQuestion} />
            <div className={styles.pagination}>
              <span className={styles.muted}>
                Page {page} of {totalPages} | Showing {questions.length} of {total}
              </span>
              <div className={styles.buttonRow}>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  disabled={page <= 1 || questionsQuery.isFetching}
                  onClick={() =>
                    setFilters((current) => ({ ...current, page: Math.max(1, page - 1) }))
                  }
                >
                  Previous
                </button>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  disabled={page >= totalPages || questionsQuery.isFetching}
                  onClick={() => setFilters((current) => ({ ...current, page: page + 1 }))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {selectedQuestion ? (
        <QuestionDrawer
          question={selectedQuestion}
          comment={reviewComment}
          isSaving={reviewMutation.isPending || updateMutation.isPending}
          isDuplicating={duplicateMutation.isPending}
          onClose={closeQuestion}
          onCommentChange={setReviewComment}
          onApprove={() => setPendingModal("approve")}
          onReject={() => setPendingModal("reject")}
          onRequestChanges={(comment) => void submitDecision("changes_requested", comment)}
          onDuplicate={() => void duplicateQuestion()}
          onSave={(values) => void saveQuestion(values)}
        />
      ) : null}

      {pendingModal === "approve" ? (
        <ApproveModal
          defaultComment={reviewComment}
          isSubmitting={reviewMutation.isPending}
          onCancel={() => setPendingModal(null)}
          onApprove={(comment) => void submitDecision("approved", comment)}
        />
      ) : null}

      {pendingModal === "reject" ? (
        <RejectModal
          defaultComment={reviewComment}
          isSubmitting={reviewMutation.isPending}
          onCancel={() => setPendingModal(null)}
          onReject={(comment) => void submitDecision("rejected", comment)}
        />
      ) : null}
    </section>
  );
}
