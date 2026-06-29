"use client";

import styles from "./rbac-components.module.scss";

type DeleteConfirmationModalProps = {
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationModal({
  entityName,
  isOpen,
  onClose,
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
        aria-labelledby="delete-modal-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="delete-modal-title">Delete {entityName}</h2>
            <p>
              This action should be restricted to authorized administrators and preserved in audit
              history.
            </p>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.dangerButton} type="button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
