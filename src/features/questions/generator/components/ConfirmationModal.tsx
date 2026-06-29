"use client";

import styles from "./question-generator.module.scss";

type ConfirmationModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function ConfirmationModal({
  isOpen,
  isSubmitting,
  onCancel,
  onSubmit
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-review-title"
      >
        <h2 id="submit-review-title">Submit Questions for Review?</h2>
        <p>These questions will be sent to the reviewer and cannot be edited unless rejected.</p>
        <div className={styles.bottomActions}>
          <button className={styles.secondaryButton} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.primaryButton}
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </section>
    </div>
  );
}
