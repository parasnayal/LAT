import { X } from "lucide-react";
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

export function MobileQuestionDrawer({
  isOpen,
  questions,
  answers,
  currentIndex,
  onClose,
  onJump
}: {
  isOpen: boolean;
  questions: AssessmentQuestion[];
  answers: StudentAnswer[];
  currentIndex: number;
  onClose: () => void;
  onJump: (index: number) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.drawerBackdrop}>
      <section className={styles.drawer} aria-label="Mobile question navigator">
        <div className={styles.drawerHeader}>
          <h2 className={styles.sideTitle}>Questions</h2>
          <button
            className={styles.ghostButton}
            type="button"
            onClick={onClose}
            aria-label="Close navigator"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <QuestionLegend />
        <div className={styles.navigatorGrid}>
          {questions.map((question, index) => {
            const status = getQuestionStatus({
              answers,
              questionId: question.id,
              isCurrent: currentIndex === index
            });

            return (
              <button
                className={`${styles.navButton} ${statusClass[status]}`}
                type="button"
                key={question.id}
                onClick={() => {
                  onJump(index);
                  onClose();
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
