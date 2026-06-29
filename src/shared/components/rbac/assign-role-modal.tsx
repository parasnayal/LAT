"use client";

import { roleFilterOptions } from "@/shared/lib/mock-rbac-data";
import styles from "./rbac-components.module.scss";

type AssignRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AssignRoleModal({ isOpen, onClose }: AssignRoleModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-role-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="assign-role-title">Assign roles</h2>
            <p>
              Select one or more enterprise roles for the user. The backend should persist this as
              user-role mappings.
            </p>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.modalBody}>
          {roleFilterOptions.map((role) => (
            <label className={styles.checkboxRow} key={role.value}>
              <input type="checkbox" />
              <span>{role.label}</span>
            </label>
          ))}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primaryButton} type="button" onClick={onClose}>
            Save roles
          </button>
        </div>
      </section>
    </div>
  );
}
