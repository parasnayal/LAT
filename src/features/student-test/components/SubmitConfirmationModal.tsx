import styles from "./student-test.module.scss";

export function SubmitConfirmationModal({
  summary,
  isSubmitting,
  onCancel,
  onSubmit
}: {
  summary: {
    totalQuestions: number;
    answered: number;
    notAnswered: number;
    markedForReview: number;
  };
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className={styles.modalBackdrop}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-assessment-title"
      >
        <h2 className={styles.modalTitle} id="submit-assessment-title">
          Submit Assessment?
        </h2>
        <p className={styles.muted}>
          You can review your answers before submitting. Once submitted, you cannot change your
          responses.
        </p>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{summary.totalQuestions}</span>
            Total Questions
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{summary.answered}</span>
            Answered
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{summary.notAnswered}</span>
            Not Answered
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{summary.markedForReview}</span>
            Marked for Review
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.ghostButton}
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Continue Test
          </button>
          <button
            className={styles.primaryButton}
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </section>
    </div>
  );
}
