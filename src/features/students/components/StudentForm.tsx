"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import styles from "./students.module.scss";
import { studentSchema, type StudentFormValues } from "../schemas/student.schema";
import {
  useActiveRegions,
  useGrades,
  useSchoolsByRegion,
  useSubjectsByGrade
} from "@/shared/hooks/useLatLookups";

type StudentFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: StudentFormValues) => Promise<void>;
};

export function StudentForm({ isSubmitting, onSubmit }: StudentFormProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>();
  const gradesQuery = useGrades();
  const regionsQuery = useActiveRegions();
  const schoolsQuery = useSchoolsByRegion(selectedRegionId);
  const grades = gradesQuery.data ?? [];
  const regions = regionsQuery.data ?? [];
  const schools = schoolsQuery.data ?? [];
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm<StudentFormValues>({
    defaultValues: {
      studentName: "",
      dob: "",
      region: "",
      school: "",
      schoolId: 0,
      grade: "",
      gradeId: 0,
      // subject: "",
      subjectId: undefined,
      mobileNumber: "",
      rollNumber: ""
    },
    resolver: zodResolver(studentSchema)
  });
  const selectedSchoolId = useWatch({ control, name: "schoolId" });
  const selectedGradeId = useWatch({ control, name: "gradeId" });
  // const selectedSubjectId = useWatch({ control, name: "subjectId" });
  // const subjectsQuery = useSubjectsByGrade(selectedGradeId);
  // const subjects = subjectsQuery.data ?? [];

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      mobileNumber: values.mobileNumber || undefined
    });
    reset();
    setSelectedRegionId(undefined);
  });

  return (
    <form className={styles.form} onSubmit={submit}>
      <h2 className={styles.sectionTitle}>Create Student</h2>
      <label className={styles.field}>
        <span className={styles.label}>Student Name *</span>
        <input className={styles.input} {...register("studentName")} placeholder="Amit Kumar" />
        {errors.studentName ? (
          <span className={styles.error}>{errors.studentName.message}</span>
        ) : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Date of Birth *</span>
        <input className={styles.input} type="date" {...register("dob")} />
        {errors.dob ? <span className={styles.error}>{errors.dob.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Region *</span>
        <select
          className={styles.select}
          value={selectedRegionId ?? ""}
          onChange={(event) => {
            const regionId = Number(event.target.value);
            const region = regions.find((item) => item.id === regionId);
            setSelectedRegionId(region?.id);
            setValue("region", region?.name ?? "", { shouldValidate: true });
            setValue("school", "", { shouldValidate: true });
            setValue("schoolId", 0, { shouldValidate: true });
          }}
          disabled={regionsQuery.isLoading}
        >
          <option value="">
            {regionsQuery.isLoading ? "Loading regions..." : "Select region"}
          </option>
          {regions.map((region) => (
            <option value={region.id} key={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        {errors.region ? <span className={styles.error}>{errors.region.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>School *</span>
        <select
          className={styles.select}
          value={selectedSchoolId || ""}
          onChange={(event) => {
            const schoolId = Number(event.target.value);
            const school = schools.find((item) => item.id === schoolId);
            setValue("school", school?.name ?? "", { shouldValidate: true });
            setValue("schoolId", school?.id ?? 0, { shouldValidate: true });
          }}
          disabled={!selectedRegionId || schoolsQuery.isLoading}
        >
          <option value="">
            {!selectedRegionId
              ? "Select region first"
              : schoolsQuery.isLoading
                ? "Loading schools..."
                : "Select school"}
          </option>
          {schools.map((school) => (
            <option value={school.id} key={school.id}>
              {school.name}
            </option>
          ))}
        </select>
        {errors.schoolId ? <span className={styles.error}>{errors.schoolId.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Grade *</span>
        <select
          className={styles.select}
          value={selectedGradeId || ""}
          onChange={(event) => {
            const gradeId = Number(event.target.value);
            const grade = grades.find((item) => item.id === gradeId);
            setValue("grade", grade?.name ?? "", { shouldValidate: true });
            setValue("gradeId", grade?.id ?? 0, { shouldValidate: true });
            // setValue("subject", "", { shouldValidate: true });
            // setValue("subjectId", undefined, { shouldValidate: true });
          }}
          disabled={gradesQuery.isLoading}
        >
          <option value="">{gradesQuery.isLoading ? "Loading grades..." : "Select grade"}</option>
          {grades.map((grade) => (
            <option value={grade.id} key={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>
        {errors.grade ? <span className={styles.error}>{errors.grade.message}</span> : null}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Mobile Number</span>
        <input
          className={styles.input}
          inputMode="numeric"
          {...register("mobileNumber")}
          placeholder="9876543210"
        />
        {errors.mobileNumber ? (
          <span className={styles.error}>{errors.mobileNumber.message}</span>
        ) : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Roll Number *</span>
        <input className={styles.input} {...register("rollNumber")} placeholder="12" />
        {errors.rollNumber ? (
          <span className={styles.error}>{errors.rollNumber.message}</span>
        ) : null}
      </label>
      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Student"}
      </button>
    </form>
  );
}
