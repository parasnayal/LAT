"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { questionGenerationSchema } from "../schemas/question-generator.schema";
import type { QuestionGenerationFormValues, SelectOption } from "../types/question-generator.types";
import styles from "./question-generator.module.scss";

type QuestionGeneratorFormProps = {
  isGenerating: boolean;
  grades: SelectOption[];
  subjects: SelectOption[];
  competencies: SelectOption[];
  learningOutcomes: SelectOption[];
  onSelectionChange: (values: Partial<QuestionGenerationFormValues>) => void;
  onGenerate: (values: QuestionGenerationFormValues) => Promise<void>;
};

export function QuestionGeneratorForm({
  isGenerating,
  grades,
  subjects,
  competencies,
  learningOutcomes,
  onSelectionChange,
  onGenerate
}: QuestionGeneratorFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<QuestionGenerationFormValues>({
    resolver: zodResolver(questionGenerationSchema),
    defaultValues: {
      gradeId: "",
      subjectId: "",
      competencyId: "",
      learningOutcomeId: "",
      difficulty: "medium",
      questionType: "mcq",
      totalQuestions: 3,
      language: "english"
    }
  });

  const gradeId = useWatch({ control, name: "gradeId" });
  const subjectId = useWatch({ control, name: "subjectId" });
  const competencyId = useWatch({ control, name: "competencyId" });
  const learningOutcomeId = useWatch({ control, name: "learningOutcomeId" });

  useEffect(() => {
    onSelectionChange({ gradeId, subjectId, competencyId, learningOutcomeId });
  }, [competencyId, gradeId, learningOutcomeId, onSelectionChange, subjectId]);

  return (
    <section className={styles.panel} aria-labelledby="question-generator-title">
      <div className={styles.panelHeader}>
        <span className={styles.panelStep}>Setup</span>
        <h1 id="question-generator-title">Generate Competency-Based Questions</h1>
        <p>Select the curriculum mapping and configure AI generation settings.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onGenerate)}>
        <SelectField
          id="gradeId"
          label="Grade"
          disabled={isGenerating}
          error={errors.gradeId?.message}
          options={grades}
          registration={register("gradeId")}
        />
        <SelectField
          id="subjectId"
          label="Subject"
          disabled={isGenerating || !gradeId}
          error={errors.subjectId?.message}
          options={subjects}
          registration={register("subjectId")}
        />
        <SelectField
          id="competencyId"
          label="Competency"
          disabled={isGenerating || !subjectId}
          error={errors.competencyId?.message}
          options={competencies}
          registration={register("competencyId")}
        />
        <SelectField
          id="learningOutcomeId"
          label="Learning Outcome"
          disabled={isGenerating || !competencyId}
          error={errors.learningOutcomeId?.message}
          options={learningOutcomes}
          registration={register("learningOutcomeId")}
        />

        <fieldset className={styles.field} disabled={isGenerating}>
          <legend>Difficulty</legend>
          <div className={styles.radioGroup}>
            {(["easy", "medium", "hard"] as const).map((difficulty) => (
              <label className={styles.radioCard} key={difficulty}>
                <input type="radio" value={difficulty} {...register("difficulty")} />
                <span>{difficulty}</span>
              </label>
            ))}
          </div>
          {errors.difficulty ? <p className={styles.error}>{errors.difficulty.message}</p> : null}
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="questionType">Question Type</label>
          <select
            id="questionType"
            className={styles.select}
            disabled={isGenerating}
            {...register("questionType")}
          >
            <option value="mcq">MCQ</option>
            <option value="true_false" disabled>
              True/False
            </option>
            <option value="short_answer" disabled>
              Short Answer
            </option>
          </select>
          {errors.questionType ? (
            <p className={styles.error}>{errors.questionType.message}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="totalQuestions">Number of Questions</label>
          <select
            id="totalQuestions"
            className={styles.select}
            disabled={isGenerating}
            {...register("totalQuestions", { valueAsNumber: true })}
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
          </select>
          {errors.totalQuestions ? (
            <p className={styles.error}>{errors.totalQuestions.message}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="language">Language</label>
          <select
            id="language"
            className={styles.select}
            disabled={isGenerating}
            {...register("language")}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
          {errors.language ? <p className={styles.error}>{errors.language.message}</p> : null}
        </div>

        <button
          className={`${styles.primaryButton} ${styles.stickyAction}`}
          type="submit"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Questions"}
        </button>
      </form>
    </section>
  );
}

type SelectFieldProps = {
  id: keyof QuestionGenerationFormValues;
  label: string;
  disabled: boolean;
  error?: string;
  options: SelectOption[];
  registration: UseFormRegisterReturn;
};

function SelectField({ id, label, disabled, error, options, registration }: SelectFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={styles.select}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        {...registration}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
