"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Pencil, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import styles from "./reviewer-questions.module.scss";
import { QuestionPreview } from "./QuestionPreview";
import { QuestionStatusBadge } from "./QuestionStatusBadge";
import { ReviewCommentBox } from "./ReviewCommentBox";
import {
  editQuestionSchema,
  type EditQuestionSchemaValues
} from "../schemas/review-question.schema";
import type {
  EditQuestionValues,
  ReviewDecision,
  ReviewerQuestion
} from "../types/reviewer-question.types";

type QuestionDrawerProps = {
  question: ReviewerQuestion;
  comment: string;
  isSaving: boolean;
  isDuplicating: boolean;
  onClose: () => void;
  onCommentChange: (comment: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: (comment: string) => void;
  onDuplicate: () => void;
  onSave: (values: EditQuestionValues) => void;
};

function toEditValues(question: ReviewerQuestion): EditQuestionSchemaValues {
  return {
    instruction: question.instruction,
    stimulus: question.stimulus,
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    learningOutcome: question.learningOutcome,
    competency: question.competency
  };
}

export function QuestionDrawer({
  question,
  comment,
  isSaving,
  isDuplicating,
  onClose,
  onCommentChange,
  onApprove,
  onReject,
  onRequestChanges,
  onDuplicate,
  onSave
}: QuestionDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = useMemo(() => toEditValues(question), [question]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EditQuestionSchemaValues>({
    defaultValues,
    resolver: zodResolver(editQuestionSchema)
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitReview = (status: ReviewDecision) => {
    if (status === "changes_requested") {
      onRequestChanges(comment.trim());
    }
  };

  return (
    <div className={styles.drawerBackdrop} role="presentation">
      <aside className={styles.drawer} aria-labelledby="question-drawer-title">
        <header className={styles.drawerHeader}>
          <div className={styles.drawerTitleRow}>
            <div>
              <p className={styles.eyebrow}>Reviewer Queue</p>
              <h2 className={styles.title} id="question-drawer-title">
                {question.questionId}
              </h2>
              <p className={styles.muted}>
                Grade {question.grade} | {question.subject} | {question.learningOutcome}
              </p>
            </div>
            <div className={styles.buttonRow}>
              <QuestionStatusBadge status={question.status} />
              <button
                className={styles.buttonGhost}
                type="button"
                onClick={onClose}
                aria-label="Close question drawer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <div className={styles.drawerBody}>
          {isEditing ? (
            <form
              className={styles.formGrid}
              id="reviewer-edit-question-form"
              onSubmit={handleSubmit(onSave)}
            >
              <label className={styles.field}>
                <span className={styles.label}>Instruction</span>
                <textarea className={styles.textarea} {...register("instruction")} />
                {errors.instruction ? (
                  <span className={styles.error}>{errors.instruction.message}</span>
                ) : null}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Stimulus</span>
                <textarea className={styles.textarea} {...register("stimulus")} />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Question</span>
                <textarea className={styles.textarea} {...register("question")} />
                {errors.question ? (
                  <span className={styles.error}>{errors.question.message}</span>
                ) : null}
              </label>

              <div className={styles.formGrid}>
                <span className={styles.label}>Options</span>
                {question.options.map((option, index) => (
                  <label className={styles.optionEditor} key={option.key}>
                    <span className={styles.optionKey}>{option.key}</span>
                    <input className={styles.input} {...register(`options.${index}.text`)} />
                  </label>
                ))}
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Correct Answer</span>
                <select className={styles.select} {...register("correctAnswer")}>
                  {question.options.map((option) => (
                    <option value={option.key} key={option.key}>
                      {option.key}
                    </option>
                  ))}
                </select>
                {errors.correctAnswer ? (
                  <span className={styles.error}>{errors.correctAnswer.message}</span>
                ) : null}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Explanation</span>
                <textarea className={styles.textarea} {...register("explanation")} />
                {errors.explanation ? (
                  <span className={styles.error}>{errors.explanation.message}</span>
                ) : null}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Learning Outcome</span>
                <input className={styles.input} {...register("learningOutcome")} />
                {errors.learningOutcome ? (
                  <span className={styles.error}>{errors.learningOutcome.message}</span>
                ) : null}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Competency</span>
                <input className={styles.input} {...register("competency")} />
                {errors.competency ? (
                  <span className={styles.error}>{errors.competency.message}</span>
                ) : null}
              </label>
            </form>
          ) : (
            <QuestionPreview question={question} />
          )}

          <ReviewCommentBox value={comment} onChange={onCommentChange} />
        </div>

        <footer className={styles.drawerFooter}>
          <div className={styles.buttonRow}>
            {isEditing ? (
              <>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  onClick={() => {
                    reset(defaultValues);
                    setIsEditing(false);
                  }}
                >
                  Cancel Edit
                </button>
                <button
                  className={styles.buttonSecondary}
                  type="submit"
                  form="reviewer-edit-question-form"
                  disabled={isSaving || isSubmitting}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={17} aria-hidden="true" />
                  Edit Question
                </button>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  onClick={onDuplicate}
                  disabled={isDuplicating}
                >
                  <Copy size={17} aria-hidden="true" />
                  {isDuplicating ? "Duplicating..." : "Duplicate"}
                </button>
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => submitReview("changes_requested")}
                  disabled={isSaving}
                >
                  <Send size={17} aria-hidden="true" />
                  Request Changes
                </button>
                <button
                  className={styles.buttonDanger}
                  type="button"
                  onClick={onReject}
                  disabled={isSaving}
                >
                  Reject
                </button>
                <button
                  className={styles.button}
                  type="button"
                  onClick={onApprove}
                  disabled={isSaving}
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );
}
