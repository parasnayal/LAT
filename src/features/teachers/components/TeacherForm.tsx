"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import styles from "./teachers.module.scss";
import { teacherSchema, type TeacherFormValues } from "../schemas/teacher.schema";
import { useRoleOptions } from "@/features/roles";
import { useActiveRegions, useSchoolsByRegion } from "@/shared/hooks/useLatLookups";

type TeacherFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: TeacherFormValues) => Promise<boolean>;
};

const defaultValues: TeacherFormValues = {
  userName: "",
  fullName: "",
  email: "",
  roleId: 0,
  schoolId: 0,
  contactNumber: ""
};

export function TeacherForm({ isSubmitting, onSubmit }: TeacherFormProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>();
  const regionsQuery = useActiveRegions();
  const schoolsQuery = useSchoolsByRegion(selectedRegionId);
  const rolesQuery = useRoleOptions();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm<TeacherFormValues>({
    defaultValues,
    resolver: zodResolver(teacherSchema)
  });
  const selectedSchoolId = useWatch({ control, name: "schoolId" });
  const selectedRoleId = useWatch({ control, name: "roleId" });
  const regions = regionsQuery.data ?? [];
  const schools = schoolsQuery.data ?? [];
  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);

  useEffect(() => {
    if (selectedRoleId || roles.length === 0) {
      return;
    }

    const teacherRole = roles.find((role) => role.name.toLowerCase() === "teacher");

    if (teacherRole) {
      setValue("roleId", teacherRole.id, { shouldValidate: true });
    }
  }, [roles, selectedRoleId, setValue]);

  const submit = handleSubmit(async (values) => {
    const didCreate = await onSubmit(values);

    if (didCreate) {
      reset(defaultValues);
      setSelectedRegionId(undefined);
    }
  });

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.field}>
        <span className={styles.label}>Username *</span>
        <input className={styles.input} {...register("userName")} placeholder="Teacher" />
        {errors.userName ? <span className={styles.error}>{errors.userName.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Full Name *</span>
        <input className={styles.input} {...register("fullName")} placeholder="Rahul Sharma" />
        {errors.fullName ? <span className={styles.error}>{errors.fullName.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Email *</span>
        <input
          className={styles.input}
          type="email"
          {...register("email")}
          placeholder="teacher@school.org"
        />
        {errors.email ? <span className={styles.error}>{errors.email.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Role *</span>
        <select
          className={styles.select}
          {...register("roleId", { valueAsNumber: true })}
          disabled={rolesQuery.isLoading}
        >
          <option value={0}>{rolesQuery.isLoading ? "Loading roles..." : "Select role"}</option>
          {roles.map((role) => (
            <option value={role.id} key={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.roleId ? <span className={styles.error}>{errors.roleId.message}</span> : null}
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Region</span>
        <select
          className={styles.select}
          value={selectedRegionId ?? ""}
          onChange={(event) => {
            const regionId = Number(event.target.value);
            const region = regions.find((item) => item.id === regionId);
            setSelectedRegionId(region?.id);
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
      </label>
      <label className={styles.field}>
        <span className={styles.label}>School ID *</span>
        <select
          className={styles.select}
          value={selectedSchoolId || ""}
          onChange={(event) => {
            const schoolId = Number(event.target.value);
            setValue("schoolId", schoolId || 0, { shouldValidate: true });
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
        <span className={styles.label}>Contact Number *</span>
        <input className={styles.input} {...register("contactNumber")} placeholder="9876543210" />
        {errors.contactNumber ? (
          <span className={styles.error}>{errors.contactNumber.message}</span>
        ) : null}
      </label>
      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Teacher"}
      </button>
    </form>
  );
}
