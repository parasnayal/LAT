import styles from "./student-test.module.scss";

export function AssessmentFooter({
  isFirstQuestion,
  isLastQuestion,
  onPrevious,
  onClear,
  onNext,
  onSubmit,
  onOpenNavigator
}: {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onClear: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onOpenNavigator: () => void;
}) {
  return (
    <footer className={styles.footer}>
      <button
        className={styles.ghostButton}
        type="button"
        disabled={isFirstQuestion}
        onClick={onPrevious}
      >
        Previous
      </button>
      <button
        className={`${styles.ghostButton} ${styles.mobileNavigatorButton}`}
        type="button"
        onClick={onOpenNavigator}
      >
        Questions
      </button>
      <button className={styles.ghostButton} type="button" onClick={onClear}>
        Clear Response
      </button>
      {isLastQuestion ? (
        <button className={styles.primaryButton} type="button" onClick={onSubmit}>
          Submit Test
        </button>
      ) : (
        <button className={styles.primaryButton} type="button" onClick={onNext}>
          Next
        </button>
      )}
    </footer>
  );
}
