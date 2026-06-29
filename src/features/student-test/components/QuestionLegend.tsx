import { Flag } from "lucide-react";
import styles from "./student-test.module.scss";

export function QuestionLegend() {
  return (
    <div className={styles.legend} aria-label="Question status legend">
      <span className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.dotAnswered}`} /> Answered
      </span>
      <span className={styles.legendItem}>
        <span className={styles.dot} /> Not Answered
      </span>
      <span className={styles.legendItem}>
        <Flag size={14} className={styles.flag} aria-hidden="true" /> Marked
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.dotCurrent}`} /> Current
      </span>
    </div>
  );
}
