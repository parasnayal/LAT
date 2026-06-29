export type ReviewQuestionStatus = "pending_review" | "approved" | "rejected" | "changes_requested";

export type ReviewDifficulty = "easy" | "medium" | "hard";

export type ReviewOption = {
  key: "A" | "B" | "C" | "D";
  text: string;
};

export type ReviewerQuestion = {
  id: string;
  questionId: string;
  grade: string;
  subject: string;
  competency: string;
  learningOutcome: string;
  difficulty: ReviewDifficulty;
  generatedBy: string;
  createdAt: string;
  status: ReviewQuestionStatus;
  instruction: string;
  stimulus?: string;
  question: string;
  options: ReviewOption[];
  correctAnswer: string;
  explanation: string;
  questionType: "MCQ" | "True/False" | "Short Answer";
  generationTime: string;
};

export type ReviewerQuestionFilters = {
  grade?: string;
  subject?: string;
  competency?: string;
  difficulty?: string;
  status?: ReviewQuestionStatus;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type ReviewerQuestionListResponse = {
  items: ReviewerQuestion[];
  page: number;
  pageSize: number;
  total: number;
};

export type ReviewDecision = "approved" | "rejected" | "changes_requested";

export type ReviewPayload = {
  status: ReviewDecision;
  reviewerComment: string;
};

export type EditQuestionValues = {
  instruction: string;
  stimulus?: string;
  question: string;
  options: ReviewOption[];
  correctAnswer: string;
  explanation: string;
  learningOutcome: string;
  competency: string;
};
