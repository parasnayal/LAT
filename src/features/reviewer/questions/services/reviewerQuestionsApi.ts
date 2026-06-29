import { axiosClient } from "@/shared/lib/axiosClient";
import type {
  EditQuestionValues,
  ReviewPayload,
  ReviewerQuestion,
  ReviewerQuestionFilters,
  ReviewerQuestionListResponse,
  ReviewOption
} from "../types/reviewer-question.types";

type BackendQuestion = Record<string, unknown>;
type BackendListResponse = {
  items?: unknown[];
  data?: unknown[];
  page?: number;
  pageSize?: number;
  total?: number;
};

function normalizeOptions(options: unknown): ReviewOption[] {
  const fallback = ["A", "B", "C", "D"].map((key) => ({
    key: key as ReviewOption["key"],
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

    const optionRecord =
      option && typeof option === "object" ? (option as Record<string, unknown>) : {};
    const normalizedKey =
      optionRecord.key === "A" ||
      optionRecord.key === "B" ||
      optionRecord.key === "C" ||
      optionRecord.key === "D"
        ? optionRecord.key
        : fallbackOption.key;

    return {
      key: normalizedKey,
      text: String(optionRecord.text ?? optionRecord.label ?? "")
    };
  });
}

function getString(item: BackendQuestion, keys: string[], fallback = "") {
  const value = keys
    .map((key) => item[key])
    .find((candidate) => candidate !== undefined && candidate !== null);
  return String(value ?? fallback);
}

function normalizeStatus(status: unknown): ReviewerQuestion["status"] {
  if (
    status === "pending_review" ||
    status === "approved" ||
    status === "rejected" ||
    status === "changes_requested"
  ) {
    return status;
  }

  return "pending_review";
}

function normalizeQuestionType(type: unknown): ReviewerQuestion["questionType"] {
  if (type === "True/False" || type === "Short Answer") {
    return type;
  }

  return "MCQ";
}

function normalizeQuestion(rawItem: unknown): ReviewerQuestion {
  const item = rawItem && typeof rawItem === "object" ? (rawItem as BackendQuestion) : {};
  const difficulty =
    item.difficulty === "easy" || item.difficulty === "hard" ? item.difficulty : "medium";

  return {
    id: getString(item, ["id"]),
    questionId: getString(item, ["questionId", "id"]),
    grade: getString(item, ["grade", "gradeName"]),
    subject: getString(item, ["subject", "subjectName"]),
    competency: getString(item, ["competency", "competencyName"]),
    learningOutcome: getString(item, ["learningOutcome", "learningOutcomeName"]),
    difficulty,
    generatedBy: getString(item, ["generatedBy", "createdByName"], "AI Generator"),
    createdAt: getString(item, ["createdAt"], new Date().toISOString()),
    status: normalizeStatus(item.status),
    instruction: getString(item, ["instruction"]),
    stimulus: getString(item, ["stimulus"]),
    question: getString(item, ["question"]),
    options: normalizeOptions(item.options),
    correctAnswer: getString(item, ["correctAnswer", "answer"]),
    explanation: getString(item, ["explanation", "rationale"]),
    questionType: normalizeQuestionType(item.questionType),
    generationTime: getString(item, ["generationTime", "generatedAt", "createdAt"])
  };
}

function normalizeList(
  data: unknown,
  filters: ReviewerQuestionFilters
): ReviewerQuestionListResponse {
  if (Array.isArray(data)) {
    return {
      items: data.map(normalizeQuestion),
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? data.length,
      total: data.length
    };
  }

  const response = data && typeof data === "object" ? (data as BackendListResponse) : {};
  const items = response.items ?? response.data ?? [];

  return {
    items: items.map(normalizeQuestion),
    page: response.page ?? filters.page ?? 1,
    pageSize: response.pageSize ?? filters.pageSize ?? items.length,
    total: response.total ?? items.length
  };
}

export const reviewerQuestionsApi = {
  async list(filters: ReviewerQuestionFilters) {
    const response = await axiosClient.get("/questions", {
      params: filters
    });

    return normalizeList(response.data, filters);
  },

  async getById(id: string) {
    const response = await axiosClient.get(`/questions/${id}`);
    return normalizeQuestion(response.data);
  },

  async review(id: string, payload: ReviewPayload) {
    const response = await axiosClient.patch(`/questions/${id}/review`, payload);
    return response.data;
  },

  async update(id: string, payload: EditQuestionValues) {
    const response = await axiosClient.patch(`/questions/${id}`, payload);
    return normalizeQuestion(response.data);
  },

  async duplicate(id: string) {
    const response = await axiosClient.post(`/questions/${id}/duplicate`);
    return normalizeQuestion(response.data);
  }
};
