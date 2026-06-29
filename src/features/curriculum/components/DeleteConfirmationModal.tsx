"use client";

import styles from "./curriculum.module.scss";

type DeleteConfirmationModalProps = {
  name: string;
  isOpen: boolean;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationModal({
  name,
  isOpen,
  isDeleting,
  onCancel,
  onConfirm
}: DeleteConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="delete-title">Delete {name}</h2>
            <p>This action cannot be undone. Related curriculum mappings may be affected.</p>
          </div>
          <button className={styles.secondaryButton} type="button" onClick={onCancel}>
            Close
          </button>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
