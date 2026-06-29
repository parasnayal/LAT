import styles from "./question-generator.module.scss";

export function QuestionSkeleton() {
  return (
    <div className={styles.skeletonCard} aria-label="Loading generated question">
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} />
    </div>
  );
}
