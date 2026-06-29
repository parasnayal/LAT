import type { GeneratedQuestionOption } from "../types/question-generator.types";
import styles from "./question-generator.module.scss";

export function QuestionOption({ option }: { option: GeneratedQuestionOption }) {
  return (
    <div className={styles.option}>
      <span className={styles.optionKey}>{option.key}</span>
      <span>{option.text}</span>
    </div>
  );
}
