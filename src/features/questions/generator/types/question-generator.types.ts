export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionType = "mcq";

export type QuestionLanguage = "english" | "hindi";

export type QuestionApprovalStatus = "pending" | "approved" | "rejected";

export type SelectOption = {
  id: string;
  name: string;
  code?: string;
  competencyId?: string;
};

export type QuestionGenerationFormValues = {
  gradeId: string;
  subjectId: string;
  competencyId: string;
  learningOutcomeId: string;
  difficulty: QuestionDifficulty;
  questionType: QuestionType;
  totalQuestions: number;
  language: QuestionLanguage;
};

export type GeneratedQuestionOption = {
  key: "A" | "B" | "C" | "D";
  text: string;
};

export type GeneratedQuestion = {
  id: string;
  approvalStatus: QuestionApprovalStatus;
  instruction: string;
  stimulus?: string;
  question: string;
  options: GeneratedQuestionOption[];
  answer: string;
  rationale: string;
  competency: string;
  learningOutcome: string;
  difficulty: QuestionDifficulty;
};

export type EditableQuestionValues = Pick<
  GeneratedQuestion,
  "instruction" | "stimulus" | "question" | "answer" | "rationale"
> & {
  options: GeneratedQuestionOption[];
};

export type RegenerateQuestionPayload = {
  questionId: string;
  context: QuestionGenerationFormValues;
};

export type SaveDraftPayload = {
  questions: GeneratedQuestion[];
  context: QuestionGenerationFormValues;
};

export type SaveAiGeneratedQuestionsPayload = {
  assessmentId: number;
  questions: Array<{
    subjectId: number;
    competencyId: number;
    learningOutcome: string;
    questionText: string;
    description: string;
    difficulty: string;
    options: Array<{
      optionText: string;
      isCorrect: boolean;
      priority: number;
    }>;
  }>;
};
