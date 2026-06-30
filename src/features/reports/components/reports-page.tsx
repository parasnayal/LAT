"use client";

import { BarChart3 } from "lucide-react";
import { useRegionReport } from "../hooks/useRegionReport";
import { RegionReportChart } from "./region-report-chart";
import styles from "./reports-page.module.scss";

export function ReportsPage() {
  const { data: regions, isLoading, isError, error, refetch, isFetching } = useRegionReport();

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerIcon}>
          <BarChart3 size={20} aria-hidden="true" />
        </span>
        <div>
          <h1>Reports</h1>
          <p>Region-wise assessment performance</p>
        </div>
      </header>

      <article className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Overall Average Scores</h2>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {isLoading ? (
          <div className={styles.state}>Loading report…</div>
        ) : isError ? (
          <div className={styles.stateError}>
            {error instanceof Error ? error.message : "Unable to load the region report."}
          </div>
        ) : !regions || regions.length === 0 ? (
          <div className={styles.state}>No region data available yet.</div>
        ) : (
          <>
            <div className={styles.chartArea}>
              <RegionReportChart regions={regions} />
            </div>
            <p className={styles.note}>
              <em>
                Note: Numbers in brackets indicate the number of students who participated in the
                test.
              </em>
            </p>
          </>
        )}
      </article>
    </section>
  );
}
