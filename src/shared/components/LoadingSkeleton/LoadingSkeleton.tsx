import styles from "../shared-ui.module.scss";

export function LoadingSkeleton() {
  return <div className={styles.skeleton} aria-label="Loading" />;
}
