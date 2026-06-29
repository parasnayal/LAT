import styles from "./question-generator.module.scss";

export function GenerationLoader() {
  return (
    <section className={styles.loader} role="status" aria-live="polite">
      <div>
        <div className={styles.spinner} aria-hidden="true" />
        <h2>Generating competency-based questions...</h2>
        <p className={styles.metaText}>Estimated time: 5-10 seconds</p>
      </div>
    </section>
  );
}
