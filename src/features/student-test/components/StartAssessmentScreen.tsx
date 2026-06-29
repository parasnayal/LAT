import { PlayCircle } from "lucide-react";
import styles from "./student-test.module.scss";
import type { StudentAssessment } from "../types/assessment.types";

export function StartAssessmentScreen({
  assessment,
  onStart
}: {
  assessment: StudentAssessment;
  onStart: () => void;
}) {
  return (
    <section className={styles.startScreen}>
      <div className={styles.startPanel}>
        <span className={styles.startMark}>LAT</span>
        <p className={styles.startEyebrow}>Student Assessment</p>
        <h1 className={styles.startTitle}>{assessment.title}</h1>
        <p className={styles.startSubtitle}>
          Start the assessment when you are ready. The timer begins after you click Start
          Assessment.
        </p>

        <div className={styles.startMetaGrid}>
          <article>
            <span>Total Questions</span>
            <strong>{assessment.questions.length}</strong>
          </article>
          <article>
            <span>Duration</span>
            <strong>{assessment.durationMinutes} min</strong>
          </article>
          <article>
            <span>Grade</span>
            <strong>{assessment.grade || "-"}</strong>
          </article>
          <article>
            <span>Subject</span>
            <strong>{assessment.subject || "-"}</strong>
          </article>
        </div>

        <button className={styles.startButton} type="button" onClick={onStart}>
          <PlayCircle size={20} aria-hidden="true" />
          Start Assessment
        </button>
      </div>
    </section>
  );
}
