import { Bookmark } from "lucide-react";
import styles from "./student-test.module.scss";
import { OptionItem } from "./OptionItem";
import type { AssessmentQuestion, StudentAnswer } from "../types/assessment.types";

export function QuestionCard({
  question,
  questionNumber,
  answer,
  onSelectOption,
  onToggleReview
}: {
  question: AssessmentQuestion;
  questionNumber: number;
  answer?: StudentAnswer;
  onSelectOption: (optionId: string) => void;
  onToggleReview: () => void;
}) {
  return (
    <article className={styles.questionCard}>
      <div className={styles.questionMeta}>
        <span className={styles.badge}>Question {questionNumber}</span>
        <button className={styles.reportButton} type="button">
          <Bookmark size={17} aria-hidden="true" /> Report
        </button>
      </div>
      <p className={styles.instruction}>{question.instruction}</p>
      {question.stimulus ? <div className={styles.stimulus}>{question.stimulus}</div> : null}
      <p className={styles.questionText}>{question.question}</p>
      <fieldset className={styles.options} aria-label={`Options for question ${questionNumber}`}>
        {question.options.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            questionId={question.id}
            isSelected={answer?.selectedOptionId === option.id}
            onSelect={onSelectOption}
          />
        ))}
      </fieldset>
      <label className={styles.reviewRow}>
        <input
          type="checkbox"
          checked={Boolean(answer?.isMarkedForReview)}
          onChange={onToggleReview}
        />
        Mark for Review
      </label>
    </article>
  );
}
