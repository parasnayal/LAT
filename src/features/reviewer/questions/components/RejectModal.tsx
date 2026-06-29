import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./reviewer-questions.module.scss";
import {
  reviewerCommentSchema,
  type ReviewerCommentValues
} from "../schemas/review-question.schema";

type RejectModalProps = {
  defaultComment: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onReject: (reason: string) => void;
};

export function RejectModal({
  defaultComment,
  isSubmitting,
  onCancel,
  onReject
}: RejectModalProps) {
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
        onSubmit={handleSubmit((values) => onReject(values.reviewerComment))}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-question-title"
      >
        <h2 id="reject-question-title">Reject Question?</h2>
        <p>Reason is required so authors can correct competency or learning outcome issues.</p>
        <label className={styles.field}>
          <span className={styles.label}>Rejection Reason</span>
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
          <button className={styles.buttonDanger} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </form>
    </div>
  );
}
