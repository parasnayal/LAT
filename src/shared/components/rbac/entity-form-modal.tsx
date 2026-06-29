"use client";

import styles from "./rbac-components.module.scss";

type EntityFormModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
};

export function EntityFormModal({ title, description, isOpen, onClose }: EntityFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-form-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="entity-form-title">{title}</h2>
            <p>{description}</p>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.modalBody}>
          <label className={styles.checkboxRow}>
            <span>Name</span>
          </label>
          <input className={styles.searchInput} type="text" placeholder="Enter name" />
          <label className={styles.checkboxRow}>
            <span>Description</span>
          </label>
          <input className={styles.searchInput} type="text" placeholder="Enter description" />
          <label className={styles.checkboxRow}>
            <span>Status</span>
          </label>
          <select className={styles.select} defaultValue="active">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primaryButton} type="button" onClick={onClose}>
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
