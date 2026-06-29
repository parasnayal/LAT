import styles from "./reviewer-questions.module.scss";

export function EmptyState() {
  return (
    <div className={styles.empty}>
      <div>
        <h3>No questions found</h3>
        <p>Try adjusting filters or search terms to find questions awaiting review.</p>
      </div>
    </div>
  );
}
