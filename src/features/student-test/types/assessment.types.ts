export type AssessmentOption = {
  id: string;
  optionId: number;
  label: string;
  value: string;
};

export type AssessmentQuestion = {
  id: string;
  questionId: number;
  instruction: string;
  stimulus?: string;
  question: string;
  options: AssessmentOption[];
};

export type AssessmentStudent = {
  name: string;
  rollNumber: string;
};

export type StudentAssessment = {
  id: string;
  attemptId: string;
  title: string;
  grade: string;
  gradeId?: number;
  subject: string;
  topic?: string;
  durationMinutes: number;
  student: AssessmentStudent;
  questions: AssessmentQuestion[];
};

export type StudentAnswer = {
  questionId: string;
  selectedOptionId?: string;
  isMarkedForReview: boolean;
};

export type AssessmentAnswerPayload = {
  assessmentId?: string;
  answers: StudentAnswer[];
};

export type QuestionStatus = "answered" | "not_answered" | "marked_for_review" | "current";
