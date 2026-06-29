import type { ButtonHTMLAttributes } from "react";
import styles from "../shared-ui.module.scss";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={styles.button} {...props} />;
}
