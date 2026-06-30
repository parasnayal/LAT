"use client";

import styles from "./question-generator.module.scss";

type QuestionToolbarProps = {
  count: number;
  approvedCount: number;
  isCreatingAssessment?: boolean;
  onCreateAssessment: () => void;
};

export function QuestionToolbar({
  count,
  approvedCount,
  isCreatingAssessment,
  onCreateAssessment
}: QuestionToolbarProps) {
  return (
    <section className={styles.toolbar} aria-label="Generated question actions">
      <div>
        <p className={styles.cardTitle}>
          {count} generated question{count === 1 ? "" : "s"}
        </p>
        <p className={styles.metaText}>
          {approvedCount} approved question{approvedCount === 1 ? "" : "s"} will be saved into the
          assessment.
        </p>
      </div>
      <div className={styles.toolbarActions}>
        <button
          className={styles.primaryButton}
          type="button"
          disabled={isCreatingAssessment || approvedCount === 0}
          onClick={onCreateAssessment}
        >
          {isCreatingAssessment ? "Creating..." : "Create Assessment"}
        </button>
      </div>
    </section>
  );
}
