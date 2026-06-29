"use client";

import { MoreVertical, PlayCircle } from "lucide-react";
import { useState } from "react";
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

function isPublishedStatus(status: string) {
  return status.trim().toLowerCase() === "published";
}

type AssessmentTableProps = {
  assessments: AssessmentListItem[];
  onStartAssessment: (assessment: AssessmentListItem) => void;
};

export function AssessmentTable({ assessments, onStartAssessment }: AssessmentTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
            <th>Type</th>
            <th>Questions</th>
            <th>Marks</th>
            <th>Duration</th>
            <th>Difficulty</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => {
            const isPublished = isPublishedStatus(assessment.status);

            return (
              <tr key={assessment.id}>
                <td>
                  <div className={styles.assessmentCell}>
                    <strong>{assessment.assessmentName}</strong>
                    {assessment.description ? <span>{assessment.description}</span> : null}
                  </div>
                </td>
                <td>{assessment.educationStage || "-"}</td>
                <td>{assessment.grade || "-"}</td>
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
                <td>
                  <div className={styles.actionMenu}>
                    <button
                      className={styles.iconButton}
                      type="button"
                      aria-label={`Open actions for ${assessment.assessmentName}`}
                      aria-expanded={openMenuId === assessment.id}
                      onClick={() =>
                        setOpenMenuId((currentId) =>
                          currentId === assessment.id ? null : assessment.id
                        )
                      }
                    >
                      <MoreVertical size={18} aria-hidden="true" />
                    </button>
                    {openMenuId === assessment.id ? (
                      <div className={styles.menuPopover} role="menu">
                        <button
                          className={styles.menuItem}
                          type="button"
                          role="menuitem"
                          disabled={isPublished}
                          onClick={() => {
                            if (isPublished) {
                              return;
                            }

                            setOpenMenuId(null);
                            onStartAssessment(assessment);
                          }}
                        >
                          <PlayCircle size={16} aria-hidden="true" />
                          <span>{isPublished ? "Already Published" : "Start Assessment"}</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
