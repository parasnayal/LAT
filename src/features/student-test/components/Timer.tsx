import { Clock3 } from "lucide-react";
import styles from "./student-test.module.scss";

export function Timer({ formattedTime, isWarning }: { formattedTime: string; isWarning: boolean }) {
  return (
    <div
      className={`${styles.timer} ${isWarning ? styles.timerWarning : ""}`}
      aria-live="polite"
      aria-label="Time remaining"
    >
      <Clock3 size={20} aria-hidden="true" />
      <div>
        <strong>{formattedTime}</strong>
        <p className={styles.muted}>Time Remaining</p>
      </div>
    </div>
  );
}
