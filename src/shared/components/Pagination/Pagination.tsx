import type { ReactNode } from "react";
import styles from "../shared-ui.module.scss";

export function Pagination({ children }: { children: ReactNode }) {
  return <div className={styles.pagination}>{children}</div>;
}
