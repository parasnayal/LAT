import styles from "./reviewer-questions.module.scss";

type ReviewCommentBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ReviewCommentBox({ value, onChange }: ReviewCommentBoxProps) {
  return (
    <section className={styles.commentBox}>
      <label className={styles.field}>
        <span className={styles.label}>Review Comments</span>
        <textarea
          aria-describedby="review-comment-hints"
          className={styles.textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Add review feedback for the question author"
        />
      </label>
      <p className={styles.muted} id="review-comment-hints">
        Examples: Stimulus is too lengthy. Distractors are weak. Question does not align with
        competency.
      </p>
    </section>
  );
}
