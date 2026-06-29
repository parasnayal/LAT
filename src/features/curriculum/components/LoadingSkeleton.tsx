import styles from "./curriculum.module.scss";

export function LoadingSkeleton() {
  return <div className={styles.skeleton} aria-label="Loading curriculum records" />;
}
