"use client";

import { useMemo } from "react";
import { AssessmentCountCard } from "./AssessmentCountCard";
import { AssessmentTable } from "./AssessmentTable";
import styles from "./assessments.module.scss";
import { useAssessments } from "../hooks/useAssessments";

export function AssessmentsPage() {
  const assessmentsQuery = useAssessments();
  const assessments = useMemo(() => assessmentsQuery.data ?? [], [assessmentsQuery.data]);
  const draftCount = assessments.filter(
    (assessment) => assessment.status.trim().toLowerCase() === "draft"
  ).length;
  const totalQuestions = assessments.reduce(
    (sum, assessment) => sum + assessment.totalQuestions,
    0
  );
  const totalMarks = assessments.reduce((sum, assessment) => sum + assessment.totalMarks, 0);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>LAT Assessments</p>
          <h1 className={styles.title}>My Assessment</h1>
          <p className={styles.subtitle}>
            Review saved and AI generated assessments available for admin.
          </p>
        </div>
      </div>

      <div className={styles.metricGrid}>
        <AssessmentCountCard label="Total Assessments" value={assessments.length} />
        <AssessmentCountCard label="Draft Assessments" value={draftCount} />
        <AssessmentCountCard label="Total Questions" value={totalQuestions} />
        <AssessmentCountCard label="Total Marks" value={totalMarks} />
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
          <AssessmentTable assessments={assessments} />
        ) : null}
      </section>
    </section>
  );
}
