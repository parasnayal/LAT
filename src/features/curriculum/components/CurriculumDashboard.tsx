"use client";

import { CurriculumHeader } from "./CurriculumHeader";
import { LoadingSkeleton } from "./LoadingSkeleton";
import styles from "./curriculum.module.scss";
import { useCurriculumSummary } from "../hooks/useCurriculumSummary";

export function CurriculumDashboard() {
  const summaryQuery = useCurriculumSummary();
  const summary = summaryQuery.data;

  return (
    <section className={styles.page}>
      <CurriculumHeader
        title="Curriculum Management"
        description="Manage the Grade, Subject, Chapter, Topic, Learning Outcome, Learning Indicator, and Competency foundation used by PARAKH LAT question generation."
      />
      {summaryQuery.isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className={styles.cardGrid}>
            <article className={styles.card}>
              <span>Total grades</span>
              <strong>{summary?.totalGrades ?? 0}</strong>
            </article>
            <article className={styles.card}>
              <span>Total subjects</span>
              <strong>{summary?.totalSubjects ?? 0}</strong>
            </article>
            <article className={styles.card}>
              <span>Total competencies</span>
              <strong>{summary?.totalCompetencies ?? 0}</strong>
            </article>
          </div>
          <div className={styles.tableShell}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Recent update</th>
                  <th>Description</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {(summary?.recentUpdates ?? []).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className={styles.title}>{item.title}</p>
                    </td>
                    <td>{item.description}</td>
                    <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
