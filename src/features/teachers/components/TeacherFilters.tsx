import styles from "./teachers.module.scss";
import type { TeacherFilters } from "../types/teacher.types";
import type { LatLookupItem } from "@/shared/types/lat-lookups.types";

type TeacherFiltersProps = {
  filters: TeacherFilters;
  regions: LatLookupItem[];
  onChange: (filters: TeacherFilters) => void;
};

export function TeacherFilters({ filters, regions, onChange }: TeacherFiltersProps) {
  return (
    <div className={styles.filters} aria-label="Teacher filters">
      <label className={styles.field}>
        <span className={styles.label}>Filter by Region</span>
        <select
          className={styles.select}
          value={filters.regionId ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              regionId: event.target.value ? Number(event.target.value) : undefined
            })
          }
        >
          <option value="">All regions</option>
          {regions.map((region) => (
            <option value={region.id} key={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Search Teacher</span>
        <input
          className={styles.input}
          type="search"
          value={filters.search ?? ""}
          onChange={(event) => onChange({ ...filters, search: event.target.value || undefined })}
          placeholder="Search by teacher name"
        />
      </label>
    </div>
  );
}
