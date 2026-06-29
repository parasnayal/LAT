"use client";

import styles from "./curriculum.module.scss";

type CurriculumHeaderProps = {
  title: string;
  description: string;
  canCreate?: boolean;
  createLabel?: string;
  onCreate?: () => void;
};

export function CurriculumHeader({
  title,
  description,
  canCreate,
  createLabel = "Create",
  onCreate
}: CurriculumHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {canCreate ? (
        <button className={styles.button} type="button" onClick={onCreate}>
          {createLabel}
        </button>
      ) : null}
    </header>
  );
}
