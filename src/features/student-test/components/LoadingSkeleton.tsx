import styles from "./student-test.module.scss";

export function LoadingSkeleton() {
  return (
    <section className={styles.loading} aria-label="Loading assessment">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className={styles.skeletonLine} key={index} />
      ))}
    </section>
  );
}
