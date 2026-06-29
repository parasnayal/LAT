"use client";

import { mockPermissions } from "@/shared/lib/mock-rbac-data";
import styles from "./rbac-components.module.scss";

type AssignPermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AssignPermissionModal({ isOpen, onClose }: AssignPermissionModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-permission-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="assign-permission-title">Assign permissions</h2>
            <p>
              Attach granular permissions to a role. New permissions can be added without changing
              role storage.
            </p>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.modalBody}>
          {mockPermissions.slice(0, 14).map((permission) => (
            <label className={styles.checkboxRow} key={permission.id}>
              <input type="checkbox" />
              <span>{permission.code}</span>
            </label>
          ))}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primaryButton} type="button" onClick={onClose}>
            Save permissions
          </button>
        </div>
      </section>
    </div>
  );
}
