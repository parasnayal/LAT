import styles from "./student-test.module.scss";

export function EmptyState({
  message = "No assessment questions are available."
}: {
  message?: string;
}) {
  return (
    <section className={styles.empty}>
      <div>
        <h2>Assessment unavailable</h2>
        <p className={styles.muted}>{message}</p>
      </div>
    </section>
  );
}
