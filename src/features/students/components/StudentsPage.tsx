"use client";

import { useMemo, useState } from "react";
import styles from "./students.module.scss";
import { StudentCountCard } from "./StudentCountCard";
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

  const countByGrade = (grade: string) =>
    students.filter((student) => student.grade === grade).length;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Teacher Workspace</p>
          <h1 className={styles.title}>Student Management</h1>
          <p className={styles.subtitle}>
            Create and view students for the logged-in teacher before assessment assignment.
          </p>
        </div>
      </header>

      <div className={styles.metricGrid}>
        <StudentCountCard label="Total Students" value={students.length} />
        <StudentCountCard label="Grade 3 Students" value={countByGrade("Grade 3")} />
        <StudentCountCard label="Grade 6 Students" value={countByGrade("Grade 6")} />
        <StudentCountCard label="Grade 9 Students" value={countByGrade("Grade 9")} />
      </div>

      <div className={canCreateStudent ? styles.contentGrid : styles.listOnlyGrid}>
        {canCreateStudent ? (
          <section className={styles.formCard}>
            <StudentForm
              isSubmitting={createStudent.isPending}
              onSubmit={async (values) => {
                await createStudent.mutateAsync(values);
              }}
            />
          </section>
        ) : null}

        <section className={styles.listCard}>
          <h2 className={styles.sectionTitle}>Student List</h2>
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
    </section>
  );
}
