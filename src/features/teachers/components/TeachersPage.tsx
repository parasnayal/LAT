"use client";

import { useMemo, useState } from "react";
import styles from "./teachers.module.scss";
import { TeacherCountCard } from "./TeacherCountCard";
import { TeacherFilters } from "./TeacherFilters";
import { TeacherForm } from "./TeacherForm";
import { TeacherTable } from "./TeacherTable";
import { useActiveRegions, useSchoolsByRegion } from "@/shared/hooks/useLatLookups";
import { useCreateTeacher, useTeachers } from "../hooks/useTeachers";
import type { TeacherFilters as TeacherFilterValues } from "../types/teacher.types";

function uniqueCount(values: string[]) {
  return new Set(values.filter(Boolean)).size;
}

export function TeachersPage() {
  const [filters, setFilters] = useState<TeacherFilterValues>({});
  const [createOpen, setCreateOpen] = useState(false);
  const teachersQuery = useTeachers();
  const regionsQuery = useActiveRegions();
  const regionSchoolsQuery = useSchoolsByRegion(filters.regionId);
  const createTeacher = useCreateTeacher();
  const teachers = useMemo(() => teachersQuery.data ?? [], [teachersQuery.data]);

  const regions = useMemo(() => regionsQuery.data ?? [], [regionsQuery.data]);
  const selectedRegionSchoolIds = useMemo(
    () => new Set((regionSchoolsQuery.data ?? []).map((school) => school.id)),
    [regionSchoolsQuery.data]
  );

  const filteredTeachers = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const matchesRegion =
        !filters.regionId ||
        teacher.regionId === filters.regionId ||
        Boolean(teacher.schoolId && selectedRegionSchoolIds.has(teacher.schoolId));
      const matchesSearch =
        !search ||
        teacher.teacherName.toLowerCase().includes(search) ||
        teacher.userName.toLowerCase().includes(search) ||
        teacher.email.toLowerCase().includes(search);
      return matchesRegion && matchesSearch;
    });
  }, [filters, selectedRegionSchoolIds, teachers]);
  const isLoadingTeachers = teachersQuery.isLoading || regionSchoolsQuery.isLoading;

  return (
    <section className={styles.page}>
      <div className={styles.metricGrid}>
        <TeacherCountCard label="Total Teachers" value={teachers.length} />
        <TeacherCountCard
          label="Total Regions"
          value={regions.length || uniqueCount(teachers.map((teacher) => teacher.region))}
        />
        <TeacherCountCard
          label="Total Schools"
          value={uniqueCount(teachers.map((teacher) => teacher.school))}
        />
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Teacher List</h2>
            <button className={styles.button} type="button" onClick={() => setCreateOpen(true)}>
              Add Teacher
            </button>
          </div>
          <TeacherFilters filters={filters} regions={regions} onChange={setFilters} />
          {isLoadingTeachers ? (
            <div className={styles.skeletonStack} aria-label="Loading teachers">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className={styles.skeletonLine} key={index} />
              ))}
            </div>
          ) : (
            <TeacherTable teachers={filteredTeachers} />
          )}
        </section>
      </div>

      {createOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-teacher-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle} id="create-teacher-title">
                  Add Teacher
                </h2>
                <p className={styles.modalSubtitle}>
                  Create a teacher account and assign it to a school.
                </p>
              </div>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setCreateOpen(false)}
              >
                Close
              </button>
            </div>
            <TeacherForm
              isSubmitting={createTeacher.isPending}
              onSubmit={async (values) => {
                try {
                  await createTeacher.mutateAsync(values);
                  setCreateOpen(false);
                  return true;
                } catch {
                  // The mutation toast shows the API error and the modal remains open.
                  return false;
                }
              }}
            />
          </section>
        </div>
      ) : null}
    </section>
  );
}
