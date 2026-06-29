import styles from "./curriculum.module.scss";

export function EmptyState({ message = "No records found." }: { message?: string }) {
  return <div className={styles.empty}>{message}</div>;
}
