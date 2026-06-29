import type { QuestionStatus, StudentAnswer } from "../types/assessment.types";

export function getAnswerForQuestion(answers: StudentAnswer[], questionId: string) {
  return answers.find((answer) => answer.questionId === questionId);
}

export function getQuestionStatus({
  answers,
  questionId,
  isCurrent
}: {
  answers: StudentAnswer[];
  questionId: string;
  isCurrent: boolean;
}): QuestionStatus {
  if (isCurrent) {
    return "current";
  }

  const answer = getAnswerForQuestion(answers, questionId);

  if (answer?.isMarkedForReview) {
    return "marked_for_review";
  }

  if (answer?.selectedOptionId) {
    return "answered";
  }

  return "not_answered";
}

export function getAssessmentSummary(answers: StudentAnswer[], totalQuestions: number) {
  const answered = answers.filter((answer) => Boolean(answer.selectedOptionId)).length;
  const markedForReview = answers.filter((answer) => answer.isMarkedForReview).length;

  return {
    totalQuestions,
    answered,
    markedForReview,
    notAnswered: Math.max(0, totalQuestions - answered)
  };
}
