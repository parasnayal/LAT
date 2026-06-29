import type { InputHTMLAttributes } from "react";
import styles from "../shared-ui.module.scss";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />;
}
