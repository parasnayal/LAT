"use client";

import { useMemo, useState } from "react";
import styles from "./students.module.scss";
import { StudentFilters } from "./StudentFilters";
import { StudentForm } from "./StudentForm";
import { StudentTable } from "./StudentTable";
import { useCreateStudent, useStudents } from "../hooks/useStudents";
import type { StudentFilters as StudentFilterValues } from "../types/student.types";

type StudentsPageProps = {
  canCreateStudent?: boolean;
};

export function StudentsPage({ canCreateStudent = false }: StudentsPageProps) {
  const [filters, setFilters] = useState<StudentFilterValues>({});
  const [createOpen, setCreateOpen] = useState(false);
  const studentsQuery = useStudents();
  const createStudent = useCreateStudent();
  const students = useMemo(() => studentsQuery.data ?? [], [studentsQuery.data]);

  const filteredStudents = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();
    return students.filter((student) => {
      const matchesGrade = !filters.grade || student.grade === filters.grade;
      const matchesSearch =
        !search ||
        student.studentName.toLowerCase().includes(search) ||
        student.rollNumber.toLowerCase().includes(search);
      return matchesGrade && matchesSearch;
    });
  }, [filters, students]);

  return (
    <section className={styles.page}>
      <div className={styles.listOnlyGrid}>
        <section className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Student List</h2>
            {canCreateStudent ? (
              <button className={styles.button} type="button" onClick={() => setCreateOpen(true)}>
                Add Student
              </button>
            ) : null}
          </div>
          <StudentFilters filters={filters} onChange={setFilters} />
          {studentsQuery.isLoading ? (
            <div className={styles.skeletonStack} aria-label="Loading students">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className={styles.skeletonLine} key={index} />
              ))}
            </div>
          ) : (
            <StudentTable students={filteredStudents} />
          )}
        </section>
      </div>

      {canCreateStudent && createOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-student-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle} id="create-student-title">
                  Add Student
                </h2>
                <p className={styles.modalSubtitle}>
                  Fill the required student details and assign the student to a school.
                </p>
              </div>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setCreateOpen(false)}
                disabled={createStudent.isPending}
              >
                Close
              </button>
            </div>
            <StudentForm
              isSubmitting={createStudent.isPending}
              onSubmit={async (values) => {
                await createStudent.mutateAsync(values);
                setCreateOpen(false);
              }}
            />
          </section>
        </div>
      ) : null}
    </section>
  );
}
