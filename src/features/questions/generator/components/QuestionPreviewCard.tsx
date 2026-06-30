"use client";

import { useState } from "react";
import { CompetencyBadge } from "./CompetencyBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { QuestionOption } from "./QuestionOption";
import type { EditableQuestionValues, GeneratedQuestion } from "../types/question-generator.types";
import styles from "./question-generator.module.scss";

type QuestionPreviewCardProps = {
  index: number;
  question: GeneratedQuestion;
  isRegenerating?: boolean;
  onUpdate: (question: GeneratedQuestion) => void;
  onDuplicate: (question: GeneratedQuestion) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
};

export function QuestionPreviewCard({
  index,
  question,
  isRegenerating,
  onUpdate,
  onDuplicate,
  onApprove,
  onReject,
  onDelete,
  onRegenerate
}: QuestionPreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditableQuestionValues>({
    instruction: question.instruction,
    stimulus: question.stimulus,
    question: question.question,
    options: question.options,
    answer: question.answer,
    rationale: question.rationale
  });

  function saveEdit() {
    onUpdate({ ...question, ...draft });
    setIsEditing(false);
  }

  function cancelEdit() {
    setDraft({
      instruction: question.instruction,
      stimulus: question.stimulus,
      question: question.question,
      options: question.options,
      answer: question.answer,
      rationale: question.rationale
    });
    setIsEditing(false);
  }

  return (
    <article
      className={`${styles.card} ${
        question.approvalStatus === "rejected" ? styles.rejectedCard : ""
      }`}
      aria-labelledby={`question-${question.id}`}
    >
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle} id={`question-${question.id}`}>
            Question {index + 1}
          </h2>
          <p className={styles.metaText}>Learning Outcome: {question.learningOutcome}</p>
          <div className={styles.badgeRow}>
            <DifficultyBadge difficulty={question.difficulty} />
            <CompetencyBadge competency={question.competency} />
            <span className={`${styles.approvalBadge} ${styles[question.approvalStatus]}`}>
              {question.approvalStatus}
            </span>
          </div>
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.primaryButton}
            type="button"
            disabled={question.approvalStatus === "approved"}
            onClick={() => onApprove(question.id)}
          >
            Approve
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={isRegenerating}
            onClick={() => onReject(question.id)}
          >
            {isRegenerating ? "Replacing..." : "Reject & Replace"}
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => onDuplicate(question)}
          >
            Duplicate
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={isRegenerating}
            onClick={() => onRegenerate(question.id)}
          >
            {isRegenerating ? "Regenerating..." : "Regenerate This Question"}
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={() => onDelete(question.id)}
          >
            Delete
          </button>
          <button
            className={styles.ghostButton}
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {isExpanded ? (
        <div className={styles.questionBody}>
          {isEditing ? (
            <EditQuestionForm
              draft={draft}
              onChange={setDraft}
              onCancel={cancelEdit}
              onSave={saveEdit}
            />
          ) : (
            <ReadOnlyQuestion question={question} />
          )}
        </div>
      ) : null}
    </article>
  );
}

function ReadOnlyQuestion({ question }: { question: GeneratedQuestion }) {
  return (
    <>
      <ContentBlock title="Instruction" content={question.instruction} />
      {question.stimulus ? <ContentBlock title="Stimulus" content={question.stimulus} /> : null}
      <ContentBlock title="Question" content={question.question} />
      <div className={styles.options}>
        {question.options.map((option) => (
          <QuestionOption option={option} key={option.key} />
        ))}
      </div>
      <ContentBlock title="Correct Answer" content={question.answer} />
      <ContentBlock title="Explanation / Rationale" content={question.rationale} />
    </>
  );
}

function ContentBlock({ title, content }: { title: string; content?: string }) {
  return (
    <section className={styles.contentBlock}>
      <h3>{title}</h3>
      <p>{content || "Not provided"}</p>
    </section>
  );
}

function EditQuestionForm({
  draft,
  onChange,
  onCancel,
  onSave
}: {
  draft: EditableQuestionValues;
  onChange: (draft: EditableQuestionValues) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  function updateOption(index: number, text: string) {
    onChange({
      ...draft,
      options: draft.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, text } : option
      )
    });
  }

  return (
    <div className={styles.form}>
      <EditableTextarea
        label="Instruction"
        value={draft.instruction}
        onChange={(value) => onChange({ ...draft, instruction: value })}
      />
      <EditableTextarea
        label="Stimulus"
        value={draft.stimulus ?? ""}
        onChange={(value) => onChange({ ...draft, stimulus: value })}
      />
      <EditableTextarea
        label="Question"
        value={draft.question}
        onChange={(value) => onChange({ ...draft, question: value })}
      />
      {draft.options.map((option, index) => (
        <div className={styles.field} key={option.key}>
          <label htmlFor={`option-${option.key}`}>Option {option.key}</label>
          <input
            id={`option-${option.key}`}
            className={styles.input}
            value={option.text}
            onChange={(event) => updateOption(index, event.target.value)}
          />
        </div>
      ))}
      <div className={styles.field}>
        <label htmlFor="answer">Correct Answer</label>
        <input
          id="answer"
          className={styles.input}
          value={draft.answer}
          onChange={(event) => onChange({ ...draft, answer: event.target.value })}
        />
      </div>
      <EditableTextarea
        label="Explanation"
        value={draft.rationale}
        onChange={(value) => onChange({ ...draft, rationale: value })}
      />
      <div className={styles.editActions}>
        <button className={styles.primaryButton} type="button" onClick={onSave}>
          Save
        </button>
        <button className={styles.secondaryButton} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function EditableTextarea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
