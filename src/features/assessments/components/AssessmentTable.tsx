import styles from "./assessments.module.scss";
import type { AssessmentListItem } from "../types/assessment.types";

function formatDate(value: string) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime()) || date.getFullYear() <= 1) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function statusClassName(status: string) {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "draft") {
    return `${styles.statusBadge} ${styles.statusDraft}`;
  }

  if (normalizedStatus === "active" || normalizedStatus === "published") {
    return `${styles.statusBadge} ${styles.statusActive}`;
  }

  return styles.statusBadge;
}

export function AssessmentTable({ assessments }: { assessments: AssessmentListItem[] }) {
  if (assessments.length === 0) {
    return <div className={styles.empty}>No assessments found.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Assessment</th>
            <th>Stage</th>
            <th>Grade</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Questions</th>
            <th>Marks</th>
            <th>Duration</th>
            <th>Difficulty</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr key={assessment.id}>
              <td>
                <div className={styles.assessmentCell}>
                  <strong>{assessment.assessmentName}</strong>
                  {assessment.description ? <span>{assessment.description}</span> : null}
                </div>
              </td>
              <td>{assessment.educationStage || "-"}</td>
              <td>{assessment.grade || "-"}</td>
              <td>{assessment.subject || "-"}</td>
              <td>{assessment.questionType || "-"}</td>
              <td>{assessment.totalQuestions}</td>
              <td>{assessment.totalMarks}</td>
              <td>{assessment.durationMinutes ? `${assessment.durationMinutes} min` : "-"}</td>
              <td>{assessment.difficultyLevel || "-"}</td>
              <td>{formatDate(assessment.assessmentDate)}</td>
              <td>
                <span className={statusClassName(assessment.status)}>
                  {assessment.status || "Unknown"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
