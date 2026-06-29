import { latApiClient } from "@/shared/lib/latApiClient";
import type {
  GeneratedQuestion,
  QuestionGenerationFormValues,
  RegenerateQuestionPayload,
  SaveAiGeneratedQuestionsPayload,
  SaveDraftPayload,
  SelectOption
} from "../types/question-generator.types";

type ApiEnvelope = {
  response?: unknown;
};

function unwrapEnvelope(data: unknown) {
  if (data && typeof data === "object" && "response" in data) {
    return (data as ApiEnvelope).response;
  }

  return data;
}

function normalizeOptions(data: unknown): SelectOption[] {
  const items = unwrapEnvelope(data);

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    id: String(item.id ?? item.gradeId ?? item.subjectId ?? item.competencyId),
    name: String(item.name ?? item.title ?? item.label ?? item.code ?? item.id),
    code: item.code ? String(item.code) : undefined,
    competencyId: item.competencyId ? String(item.competencyId) : undefined
  }));
}

function normalizeQuestions(data: unknown): GeneratedQuestion[] {
  const items = unwrapEnvelope(data);

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    id: String(item.id ?? crypto.randomUUID()),
    instruction: String(item.instruction ?? "Read the question and choose the correct answer."),
    stimulus: item.stimulus ? String(item.stimulus) : "",
    question: String(item.question ?? `Generated question ${index + 1}`),
    options: normalizeQuestionOptions(item.options),
    answer: String(item.answer ?? "A"),
    rationale: String(item.rationale ?? item.explanation ?? ""),
    competency: String(item.competency ?? ""),
    learningOutcome: String(item.learningOutcome ?? ""),
    difficulty:
      item.difficulty === "hard" || item.difficulty === "easy" ? item.difficulty : "medium"
  }));
}

function normalizeQuestionOptions(options: unknown) {
  const fallback = ["A", "B", "C", "D"].map((key) => ({
    key: key as "A" | "B" | "C" | "D",
    text: ""
  }));

  if (!Array.isArray(options)) {
    return fallback;
  }

  return fallback.map((fallbackOption, index) => {
    const option = options[index];

    if (typeof option === "string") {
      return { ...fallbackOption, text: option };
    }

    return {
      key: option?.key ?? fallbackOption.key,
      text: String(option?.text ?? option?.label ?? "")
    };
  });
}

export const questionGeneratorApi = {
  async getGrades() {
    const response = await latApiClient.get("/grades");
    return normalizeOptions(response.data);
  },

  async getSubjects(gradeId?: string) {
    const response = gradeId
      ? await latApiClient.get(`/subjects/${gradeId}`)
      : await latApiClient.get("/subjects");
    return normalizeOptions(response.data);
  },

  async getCompetencies(subjectId?: string) {
    const response = await latApiClient.get("/competencies", { params: { subjectId } });
    return normalizeOptions(response.data);
  },

  async getLearningOutcomes(competencyId?: string) {
    const response = await latApiClient.get("/learning-outcomes", { params: { competencyId } });
    return normalizeOptions(response.data);
  },

  async generate(payload: QuestionGenerationFormValues) {
    const response = await latApiClient.post("/questions/generate", {
      gradeId: payload.gradeId,
      subjectId: payload.subjectId,
      competencyId: payload.competencyId,
      learningOutcomeId: payload.learningOutcomeId,
      difficulty: payload.difficulty,
      questionType: payload.questionType,
      totalQuestions: payload.totalQuestions,
      language: payload.language
    });

    return normalizeQuestions(response.data);
  },

  async regenerate(payload: RegenerateQuestionPayload) {
    const response = await latApiClient.post("/questions/regenerate", payload);
    const questions = normalizeQuestions(
      Array.isArray(response.data) ? response.data : [response.data]
    );
    return questions[0];
  },

  async saveDraft(payload: SaveDraftPayload) {
    const response = await latApiClient.post("/questions", payload);
    return response.data;
  },

  async saveAiGeneratedQuestions(payload: SaveAiGeneratedQuestionsPayload) {
    const response = await latApiClient.post("/save-ai-generated-questions", payload);
    return response.data;
  },

  async submitReview(questionId: string) {
    const response = await latApiClient.patch(`/questions/${questionId}/submit-review`);
    return response.data;
  }
};
