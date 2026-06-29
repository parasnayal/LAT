"use client";

import styles from "./curriculum.module.scss";

export type SelectOption = {
  value: string;
  label: string;
};

type CurriculumSelectProps = {
  id: string;
  label: string;
  value?: string;
  error?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
};

function CurriculumSelect({
  id,
  label,
  value,
  error,
  options,
  onChange,
  required
}: CurriculumSelectProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={styles.select}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        required={required}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

export function GradeSelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Grade" />;
}

export function SubjectSelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Subject" />;
}

export function ChapterSelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Chapter" />;
}

export function TopicSelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Topic" />;
}

export function LearningOutcomeSelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Learning outcome" />;
}

export function LearningIndicatorSelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Learning indicator" />;
}

export function CompetencySelect(props: Omit<CurriculumSelectProps, "label">) {
  return <CurriculumSelect {...props} label="Competency" />;
}
