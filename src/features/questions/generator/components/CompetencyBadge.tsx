import styles from "./question-generator.module.scss";

export function CompetencyBadge({ competency }: { competency: string }) {
  return <span className={styles.competencyBadge}>{competency || "Competency"}</span>;
}
