import { Flag } from "lucide-react";
import styles from "./student-test.module.scss";
import { QuestionLegend } from "./QuestionLegend";
import type { AssessmentQuestion, StudentAnswer } from "../types/assessment.types";
import { getQuestionStatus } from "../utils/assessmentStatus";

const statusClass = {
  answered: styles.navAnswered,
  not_answered: "",
  marked_for_review: styles.navMarked,
  current: styles.navCurrent
};

export function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  onJump
}: {
  questions: AssessmentQuestion[];
  answers: StudentAnswer[];
  currentIndex: number;
  onJump: (index: number) => void;
}) {
  return (
    <aside className={styles.sidePanel} aria-label="Question navigator">
      <h2 className={styles.sideTitle}>Questions</h2>
      <QuestionLegend />
      <div className={styles.navigatorGrid}>
        {questions.map((question, index) => {
          const status = getQuestionStatus({
            answers,
            questionId: question.id,
            isCurrent: currentIndex === index
          });
          const isMarked = answers.find(
            (answer) => answer.questionId === question.id
          )?.isMarkedForReview;

          return (
            <button
              className={`${styles.navButton} ${statusClass[status]}`}
              type="button"
              key={question.id}
              onClick={() => onJump(index)}
              aria-label={`Go to question ${index + 1}, ${status.replaceAll("_", " ")}`}
            >
              {index + 1}
              {isMarked ? <Flag size={12} className={styles.flag} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
      <div className={styles.helperBox}>
        You can review your answers before submitting the test.
      </div>
    </aside>
  );
}
