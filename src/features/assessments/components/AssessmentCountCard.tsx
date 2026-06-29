import styles from "./assessments.module.scss";

type AssessmentCountCardProps = {
  label: string;
  value: string | number;
};

export function AssessmentCountCard({ label, value }: AssessmentCountCardProps) {
  return (
    <article className={styles.card}>
      <p className={styles.cardLabel}>{label}</p>
      <h2 className={styles.cardValue}>{value}</h2>
    </article>
  );
}
