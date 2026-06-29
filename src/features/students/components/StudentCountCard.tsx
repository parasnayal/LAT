import styles from "./students.module.scss";

export function StudentCountCard({ label, value }: { label: string; value: number }) {
  return (
    <section className={styles.card} aria-label={`${label}: ${value}`}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
    </section>
  );
}
