import styles from "./reviewer-questions.module.scss";

export function LoadingSkeleton() {
  return (
    <div className={styles.skeletonStack} aria-label="Loading questions">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className={styles.skeletonLine} key={index} />
      ))}
    </div>
  );
}
