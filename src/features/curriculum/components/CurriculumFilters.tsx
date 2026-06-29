"use client";

import type { CurriculumListParams } from "../types/curriculum.types";
import styles from "./curriculum.module.scss";

type Option = {
  value: string;
  label: string;
};

type CurriculumFiltersProps = {
  filters: CurriculumListParams;
  onChange: (filters: CurriculumListParams) => void;
  gradeOptions?: Option[];
  subjectOptions?: Option[];
  chapterOptions?: Option[];
};

export function CurriculumFilters({
  filters,
  onChange,
  gradeOptions = [],
  subjectOptions = [],
  chapterOptions = []
}: CurriculumFiltersProps) {
  function update(key: keyof CurriculumListParams, value: string) {
    onChange({ ...filters, [key]: value || undefined, page: 1 });
  }

  return (
    <div className={styles.toolbar}>
      <input
        className={styles.input}
        value={filters.search ?? ""}
        onChange={(event) => update("search", event.target.value)}
        placeholder="Search by name or code"
        aria-label="Search curriculum records"
      />
      <select
        className={styles.select}
        value={filters.status ?? ""}
        onChange={(event) => update("status", event.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {gradeOptions.length ? (
        <select
          className={styles.select}
          value={filters.gradeId ?? ""}
          onChange={(event) => update("gradeId", event.target.value)}
          aria-label="Filter by grade"
        >
          <option value="">All grades</option>
          {gradeOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {subjectOptions.length ? (
        <select
          className={styles.select}
          value={filters.subjectId ?? ""}
          onChange={(event) => update("subjectId", event.target.value)}
          aria-label="Filter by subject"
        >
          <option value="">All subjects</option>
          {subjectOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {chapterOptions.length ? (
        <select
          className={styles.select}
          value={filters.chapterId ?? ""}
          onChange={(event) => update("chapterId", event.target.value)}
          aria-label="Filter by chapter"
        >
          <option value="">All chapters</option>
          {chapterOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
