import type { QuestionDifficulty } from "../types/question-generator.types";
import styles from "./question-generator.module.scss";

export function DifficultyBadge({ difficulty }: { difficulty: QuestionDifficulty }) {
  return <span className={styles.difficultyBadge}>{difficulty}</span>;
}
