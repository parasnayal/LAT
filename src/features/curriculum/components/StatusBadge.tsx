import type { CurriculumStatus } from "../types/curriculum.types";
import styles from "./curriculum.module.scss";

export function StatusBadge({ status }: { status: CurriculumStatus }) {
  return <span className={status === "active" ? styles.status : styles.inactive}>{status}</span>;
}
