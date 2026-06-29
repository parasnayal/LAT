import styles from "./teachers.module.scss";

export function TeacherCountCard({ label, value }: { label: string; value: number }) {
  return (
    <section className={styles.card} aria-label={`${label}: ${value}`}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
    </section>
  );
}
