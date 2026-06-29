import styles from "./student-test.module.scss";
import type { AssessmentOption } from "../types/assessment.types";

export function OptionItem({
  option,
  questionId,
  isSelected,
  onSelect
}: {
  option: AssessmentOption;
  questionId: string;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}) {
  return (
    <label className={`${styles.optionItem} ${isSelected ? styles.optionItemSelected : ""}`}>
      <input
        className={styles.radio}
        type="radio"
        name={`question-${questionId}`}
        checked={isSelected}
        onChange={() => onSelect(option.id)}
      />
      <span className={styles.optionLabel}>{option.label}.</span>
      <span>{option.value}</span>
    </label>
  );
}
