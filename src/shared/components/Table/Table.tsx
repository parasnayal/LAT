import type { TableHTMLAttributes } from "react";
import styles from "../shared-ui.module.scss";

export function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={styles.table} {...props} />;
}
