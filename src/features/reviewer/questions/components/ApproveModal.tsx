import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./reviewer-questions.module.scss";
import {
  reviewerCommentSchema,
  type ReviewerCommentValues
} from "../schemas/review-question.schema";

type ApproveModalProps = {
  defaultComment: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onApprove: (comment: string) => void;
};

export function ApproveModal({
  defaultComment,
  isSubmitting,
  onCancel,
  onApprove
}: ApproveModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReviewerCommentValues>({
    defaultValues: { reviewerComment: defaultComment },
    resolver: zodResolver(reviewerCommentSchema)
  });

  return (
    <div className={styles.modalBackdrop}>
      <form
        className={styles.modal}
        onSubmit={handleSubmit((values) => onApprove(values.reviewerComment))}
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-question-title"
      >
        <h2 id="approve-question-title">Approve Question?</h2>
        <p>This will approve the question and move it into the question bank after API success.</p>
        <label className={styles.field}>
          <span className={styles.label}>Reviewer Comment</span>
          <textarea className={styles.textarea} {...register("reviewerComment")} />
          {errors.reviewerComment ? (
            <span className={styles.error}>{errors.reviewerComment.message}</span>
          ) : null}
        </label>
        <div className={styles.buttonRow}>
          <button
            className={styles.buttonGhost}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Approving..." : "Approve"}
          </button>
        </div>
      </form>
    </div>
  );
}
