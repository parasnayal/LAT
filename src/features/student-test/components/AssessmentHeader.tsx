import { ChevronDown } from "lucide-react";
import styles from "./student-test.module.scss";
import { Timer } from "./Timer";
import type { StudentAssessment } from "../types/assessment.types";

export function AssessmentHeader({
  assessment,
  formattedTime,
  isWarning,
  onEndTest
}: {
  assessment: StudentAssessment;
  formattedTime: string;
  isWarning: boolean;
  onEndTest: () => void;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>LAT</span>
        <div>
          <p className={styles.brandName}>PARAKH LAT</p>
          <p className={styles.breadcrumb}>
            {assessment.grade} • {assessment.subject} • {assessment.topic ?? assessment.title}
          </p>
        </div>
      </div>
      <Timer formattedTime={formattedTime} isWarning={isWarning} />
      <button className={styles.endButton} type="button" onClick={onEndTest}>
        End Test
      </button>
      <div className={styles.profile}>
        <span className={styles.avatar}>{assessment.student.name.charAt(0).toUpperCase()}</span>
        <div>
          <strong>{assessment.student.name}</strong>
          <p className={styles.muted}>Roll No: {assessment.student.rollNumber}</p>
        </div>
        <ChevronDown size={18} aria-hidden="true" />
      </div>
    </header>
  );
}
