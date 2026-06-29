import styles from "./reviewer-questions.module.scss";
import type {
  ReviewQuestionStatus,
  ReviewerQuestionFilters
} from "../types/reviewer-question.types";

const statusOptions: Array<{ label: string; value: ReviewQuestionStatus }> = [
  { label: "Pending Review", value: "pending_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" }
];

type FilterBarProps = {
  filters: ReviewerQuestionFilters;
  onChange: (filters: ReviewerQuestionFilters) => void;
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const updateFilter = (key: keyof ReviewerQuestionFilters, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
      page: 1
    });
  };

  return (
    <div className={styles.filterBar} aria-label="Reviewer question filters">
      <label className={styles.field}>
        <span className={styles.label}>Grade</span>
        <select
          className={styles.select}
          value={filters.grade ?? ""}
          onChange={(event) => updateFilter("grade", event.target.value)}
        >
          <option value="">All grades</option>
          <option value="3">Grade 3</option>
          <option value="6">Grade 6</option>
          <option value="9">Grade 9</option>
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Subject</span>
        <input
          className={styles.input}
          value={filters.subject ?? ""}
          onChange={(event) => updateFilter("subject", event.target.value)}
          placeholder="Mathematics"
          type="search"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Competency</span>
        <input
          className={styles.input}
          value={filters.competency ?? ""}
          onChange={(event) => updateFilter("competency", event.target.value)}
          placeholder="Problem solving"
          type="search"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Difficulty</span>
        <select
          className={styles.select}
          value={filters.difficulty ?? ""}
          onChange={(event) => updateFilter("difficulty", event.target.value)}
        >
          <option value="">All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Status</span>
        <select
          className={styles.select}
          value={filters.status ?? "pending_review"}
          onChange={(event) => updateFilter("status", event.target.value)}
        >
          {statusOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={`${styles.field} ${styles.fieldWide}`}>
        <span className={styles.label}>Search by Question</span>
        <input
          className={styles.input}
          value={filters.search ?? ""}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search instruction, stimulus, or question text"
          type="search"
        />
      </label>
    </div>
  );
}
