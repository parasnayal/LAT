import styles from "./reviewer-questions.module.scss";
import type { ReviewQuestionStatus } from "../types/reviewer-question.types";

const STATUS_LABELS: Record<ReviewQuestionStatus, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes Requested"
};

const STATUS_CLASSES: Record<ReviewQuestionStatus, string> = {
  pending_review: styles.statusPending,
  approved: styles.statusApproved,
  rejected: styles.statusRejected,
  changes_requested: styles.statusChanges
};

export function QuestionStatusBadge({ status }: { status: ReviewQuestionStatus }) {
  return (
    <span className={`${styles.status} ${STATUS_CLASSES[status]}`}>{STATUS_LABELS[status]}</span>
  );
}
