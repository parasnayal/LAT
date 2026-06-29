import styles from "./question-generator.module.scss";

export function EmptyState() {
  return (
    <section className={styles.emptyState}>
      <div>
        <div className={styles.emptyIllustration} aria-hidden="true">
          AI
        </div>
        <h2>Generated questions will appear here.</h2>
        <p>
          Select curriculum, configure the generation settings, and generate competency-based
          questions for review.
        </p>
      </div>
    </section>
  );
}
