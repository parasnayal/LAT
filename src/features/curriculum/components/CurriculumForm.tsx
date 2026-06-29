"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getCurriculumSchema } from "../schemas/curriculum.schema";
import type {
  CurriculumEntity,
  CurriculumEntityKind,
  CurriculumFormValues
} from "../types/curriculum.types";
import {
  ChapterSelect,
  GradeSelect,
  LearningIndicatorSelect,
  LearningOutcomeSelect,
  SubjectSelect,
  TopicSelect,
  type SelectOption
} from "./selects";
import styles from "./curriculum.module.scss";

type CurriculumFormProps = {
  kind: CurriculumEntityKind;
  title: string;
  isOpen: boolean;
  isSubmitting?: boolean;
  initialValue?: CurriculumEntity | null;
  gradeOptions?: SelectOption[];
  subjectOptions?: SelectOption[];
  chapterOptions?: SelectOption[];
  topicOptions?: SelectOption[];
  learningOutcomeOptions?: SelectOption[];
  learningIndicatorOptions?: SelectOption[];
  onCancel: () => void;
  onSubmit: (values: CurriculumFormValues) => Promise<void>;
};

export function CurriculumForm({
  kind,
  title,
  isOpen,
  isSubmitting,
  initialValue,
  gradeOptions = [],
  subjectOptions = [],
  chapterOptions = [],
  topicOptions = [],
  learningOutcomeOptions = [],
  learningIndicatorOptions = [],
  onCancel,
  onSubmit
}: CurriculumFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm<CurriculumFormValues>({
    resolver: zodResolver(getCurriculumSchema(kind)),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      status: "active"
    }
  });

  useEffect(() => {
    const relationValue = (key: keyof CurriculumFormValues) =>
      initialValue && key in initialValue
        ? String((initialValue as Record<string, unknown>)[key] ?? "")
        : "";

    reset({
      name: initialValue?.name ?? "",
      code: initialValue?.code ?? "",
      description: initialValue?.description ?? "",
      status: initialValue?.status ?? "active",
      gradeId: relationValue("gradeId"),
      subjectId: relationValue("subjectId"),
      chapterId: relationValue("chapterId"),
      topicId: relationValue("topicId"),
      learningOutcomeId: relationValue("learningOutcomeId"),
      learningIndicatorId: relationValue("learningIndicatorId")
    });
  }, [initialValue, reset]);

  const gradeId = useWatch({ control, name: "gradeId" });
  const subjectId = useWatch({ control, name: "subjectId" });
  const chapterId = useWatch({ control, name: "chapterId" });
  const topicId = useWatch({ control, name: "topicId" });
  const learningOutcomeId = useWatch({ control, name: "learningOutcomeId" });
  const learningIndicatorId = useWatch({ control, name: "learningIndicatorId" });

  if (!isOpen) {
    return null;
  }

  const showGrade = [
    "subjects",
    "chapters",
    "topics",
    "learning-outcomes",
    "competencies"
  ].includes(kind);
  const showSubject = ["chapters", "topics", "learning-outcomes", "competencies"].includes(kind);
  const showChapter = ["topics", "learning-outcomes"].includes(kind);
  const showTopic = kind === "learning-outcomes";
  const showLearningOutcome = ["learning-indicators", "competencies"].includes(kind);
  const showLearningIndicator = kind === "competencies";

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="curriculum-form-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="curriculum-form-title">{title}</h2>
            <p>
              Keep curriculum records normalized so every generated question can be traced to the
              full competency map.
            </p>
          </div>
          <button className={styles.secondaryButton} type="button" onClick={onCancel}>
            Close
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className={styles.input}
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <p className={styles.error}>{errors.name.message}</p> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="code">Code</label>
            <input
              id="code"
              className={styles.input}
              {...register("code")}
              aria-invalid={Boolean(errors.code)}
            />
            {errors.code ? <p className={styles.error}>{errors.code.message}</p> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <textarea id="description" className={styles.textarea} {...register("description")} />
          </div>
          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className={styles.select}
              {...register("status")}
              aria-invalid={Boolean(errors.status)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status ? <p className={styles.error}>{errors.status.message}</p> : null}
          </div>
          {showGrade ? (
            <GradeSelect
              id="gradeId"
              value={gradeId}
              options={gradeOptions}
              error={errors.gradeId?.message}
              required
              onChange={(value) => setValue("gradeId", value, { shouldValidate: true })}
            />
          ) : null}
          {showSubject ? (
            <SubjectSelect
              id="subjectId"
              value={subjectId}
              options={subjectOptions}
              error={errors.subjectId?.message}
              required
              onChange={(value) => setValue("subjectId", value, { shouldValidate: true })}
            />
          ) : null}
          {showChapter ? (
            <ChapterSelect
              id="chapterId"
              value={chapterId}
              options={chapterOptions}
              error={errors.chapterId?.message}
              required
              onChange={(value) => setValue("chapterId", value, { shouldValidate: true })}
            />
          ) : null}
          {showTopic ? (
            <TopicSelect
              id="topicId"
              value={topicId}
              options={topicOptions}
              error={errors.topicId?.message}
              onChange={(value) => setValue("topicId", value, { shouldValidate: true })}
            />
          ) : null}
          {showLearningOutcome ? (
            <LearningOutcomeSelect
              id="learningOutcomeId"
              value={learningOutcomeId}
              options={learningOutcomeOptions}
              error={errors.learningOutcomeId?.message}
              required
              onChange={(value) => setValue("learningOutcomeId", value, { shouldValidate: true })}
            />
          ) : null}
          {showLearningIndicator ? (
            <LearningIndicatorSelect
              id="learningIndicatorId"
              value={learningIndicatorId}
              options={learningIndicatorOptions}
              error={errors.learningIndicatorId?.message}
              required
              onChange={(value) => setValue("learningIndicatorId", value, { shouldValidate: true })}
            />
          ) : null}
          <div className={styles.modalFooter}>
            <button className={styles.secondaryButton} type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className={styles.button} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
