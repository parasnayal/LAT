"use client";

import { useMemo, useState } from "react";
import { AssessmentCountCard } from "./AssessmentCountCard";
import { AssessmentTable } from "./AssessmentTable";
import styles from "./assessments.module.scss";
import { useAssessments, useStartAssessment } from "../hooks/useAssessments";
import type { AssessmentListItem } from "../types/assessment.types";

export function AssessmentsPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentListItem | null>(null);
  const assessmentsQuery = useAssessments();
  const startAssessment = useStartAssessment();
  const assessments = useMemo(() => assessmentsQuery.data ?? [], [assessmentsQuery.data]);
  const draftCount = assessments.filter(
    (assessment) => assessment.status.trim().toLowerCase() === "draft"
  ).length;
  const totalQuestions = assessments.reduce(
    (sum, assessment) => sum + assessment.totalQuestions,
    0
  );
  // const totalMarks = assessments.reduce((sum, assessment) => sum + assessment.totalMarks, 0);

  return (
    <section className={styles.page}>
      <div className={styles.metricGrid}>
        <AssessmentCountCard label="Total Assessments" value={assessments.length} />
        <AssessmentCountCard label="Draft Assessments" value={draftCount} />
        <AssessmentCountCard label="Total Questions" value={totalQuestions} />
        {/* <AssessmentCountCard label="Total Marks" value={totalMarks} /> */}
      </div>

      <section className={styles.listCard}>
        <div className={styles.listHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Assessment List</h2>
            <p className={styles.sectionSubtitle}>Saved assessments ready for review.</p>
          </div>
        </div>

        {assessmentsQuery.isLoading ? (
          <div className={styles.skeletonStack} aria-label="Loading assessments">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className={styles.skeletonLine} key={index} />
            ))}
          </div>
        ) : null}

        {assessmentsQuery.isError ? (
          <div className={styles.empty}>
            {assessmentsQuery.error instanceof Error
              ? assessmentsQuery.error.message
              : "Unable to load assessments."}
          </div>
        ) : null}

        {!assessmentsQuery.isLoading && !assessmentsQuery.isError ? (
          <AssessmentTable
            assessments={assessments}
            onStartAssessment={(assessment) => setSelectedAssessment(assessment)}
          />
        ) : null}
      </section>

      {selectedAssessment ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-assessment-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle} id="start-assessment-title">
                  Start Assessment
                </h2>
                <p className={styles.modalSubtitle}>
                  Publish and start {selectedAssessment.assessmentName}.
                </p>
              </div>
            </div>
            <p className={styles.modalBody}>
              Students will be able to access this assessment after it starts.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                disabled={startAssessment.isPending}
                onClick={() => setSelectedAssessment(null)}
              >
                Cancel
              </button>
              <button
                className={styles.primaryButton}
                type="button"
                disabled={startAssessment.isPending}
                onClick={async () => {
                  try {
                    await startAssessment.mutateAsync(selectedAssessment.id);
                    setSelectedAssessment(null);
                  } catch {
                    // Toast handles the error state.
                  }
                }}
              >
                {startAssessment.isPending ? "Starting..." : "Start Assessment"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
