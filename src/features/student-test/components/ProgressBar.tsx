import styles from "./student-test.module.scss";

export function ProgressBar({
  current,
  total,
  answered
}: {
  current: number;
  total: number;
  answered: number;
}) {
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className={styles.progressRow}>
      <strong>
        {current} / {total} Questions
      </strong>
      <div className={styles.progressTrack} aria-label={`${percent}% completed`}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
      <strong>{percent}%</strong>
    </div>
  );
}
