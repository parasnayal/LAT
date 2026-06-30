import styles from "./students.module.scss";
import type { StudentFilters as StudentFilterValues } from "../types/student.types";

type StudentFiltersProps = {
  filters: StudentFilterValues;
  onChange: (filters: StudentFilterValues) => void;
};

export function StudentFilters({ filters, onChange }: StudentFiltersProps) {
  return (
    <div className={styles.filters} aria-label="Student filters">
      <label className={styles.field}>
        <span className={styles.label}>Filter by Grade</span>
        <select
          className={styles.select}
          value={filters.grade ?? ""}
          onChange={(event) => onChange({ ...filters, grade: event.target.value || undefined })}
        >
          <option value="">All grades</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 9">Grade 9</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Search Student</span>
        <input
          className={styles.input}
          type="search"
          value={filters.search ?? ""}
          onChange={(event) => onChange({ ...filters, search: event.target.value || undefined })}
          placeholder="Search by name"
        />
      </label>
    </div>
  );
}
