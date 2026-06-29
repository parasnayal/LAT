import styles from "./reviewer-questions.module.scss";
import type { ReviewerQuestion } from "../types/reviewer-question.types";

function PreviewCard({
  label,
  value,
  wide = false
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  return (
    <section className={`${styles.previewCard} ${wide ? styles.previewCardFull : ""}`}>
      <p className={styles.previewLabel}>{label}</p>
      <p className={styles.previewText}>{value || "Not provided"}</p>
    </section>
  );
}

export function QuestionPreview({ question }: { question: ReviewerQuestion }) {
  return (
    <div className={styles.previewGrid}>
      <PreviewCard label="Instruction" value={question.instruction} wide />
      <PreviewCard label="Stimulus" value={question.stimulus} wide />
      <PreviewCard label="Question" value={question.question} wide />

      <section className={`${styles.previewCard} ${styles.previewCardFull}`}>
        <p className={styles.previewLabel}>Options</p>
        <ul className={styles.optionList}>
          {question.options.map((option) => (
            <li className={styles.option} key={option.key}>
              <span className={styles.optionKey}>{option.key}</span>
              <span>{option.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <PreviewCard label="Correct Answer" value={question.correctAnswer} />
      <PreviewCard label="Difficulty" value={question.difficulty} />
      <PreviewCard label="Explanation" value={question.explanation} wide />
      <PreviewCard label="Competency" value={question.competency} />
      <PreviewCard label="Learning Outcome" value={question.learningOutcome} />
      <PreviewCard label="Question Type" value={question.questionType} />
      <PreviewCard label="Generation Time" value={question.generationTime} />
    </div>
  );
}
