import { latApiClient } from "@/shared/lib/latApiClient";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type {
  AssessmentAnswerPayload,
  AssessmentOption,
  AssessmentQuestion,
  StudentAssessment
} from "../types/assessment.types";

type BackendRecord = Record<string, unknown>;

type AssessmentAvailability = {
  isAvailable: boolean;
  message?: string;
};

function toNumericId(value: unknown, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : fallback;
}

function resolveAssessmentId(assessmentId: string) {
  return toNumericId(assessmentId, 1);
}

function parseLatEnvelope(
  data: LatApiEnvelope<unknown> | string,
  options: { allowPlainTextSuccess?: boolean } = {}
): LatApiEnvelope<unknown> {
  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data) as LatApiEnvelope<unknown>;
  } catch {
    return {
      status: options.allowPlainTextSuccess ? 1 : 0,
      message: data
    };
  }
}

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === "object" ? (value as BackendRecord) : {};
}

function toBooleanAvailability(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (["true", "1", "yes", "available"].includes(normalizedValue)) {
      return true;
    }
    if (["false", "0", "no", "not available", "unavailable"].includes(normalizedValue)) {
      return false;
    }
  }

  return fallback;
}

function normalizeAssessmentAvailability(data: LatApiEnvelope<unknown>): AssessmentAvailability {
  const response = data.response;
  const record = asRecord(response);
  const explicitValue =
    record.isAvailable ??
    record.assessmentAvailable ??
    record.available ??
    record.hasAssessment ??
    response;

  return {
    isAvailable: data.status === 1 && toBooleanAvailability(explicitValue, Boolean(response)),
    message: data.message
  };
}

function normalizeOption(option: unknown, index: number): AssessmentOption {
  const record = asRecord(option);
  const fallbackLabel = String.fromCharCode(65 + index);
  const optionId = toNumericId(record.optionId ?? record.id, index + 1);

  return {
    id: String(optionId),
    optionId,
    label: String(record.label ?? fallbackLabel),
    value: String(record.value ?? record.text ?? record.optionText ?? "")
  };
}

function normalizeQuestion(question: unknown, index: number): AssessmentQuestion {
  const record = asRecord(question);
  const options = Array.isArray(record.options) ? record.options : [];
  const questionId = toNumericId(record.questionId ?? record.id, index + 1);

  return {
    id: String(questionId),
    questionId,
    instruction: String(record.instruction ?? "Read the question carefully and choose one option."),
    stimulus: record.stimulus ? String(record.stimulus) : "",
    question: String(record.question ?? record.questionText ?? ""),
    options: options.map(normalizeOption)
  };
}

function getDurationMinutesByGradeId(gradeId: number, fallbackDuration: number) {
  switch (gradeId) {
    case 3:
      return 90;
    case 6:
      return 120;
    case 9:
      return 150;
    default:
      return fallbackDuration;
  }
}

function normalizeAssessment(payload: unknown): StudentAssessment {
  const source = asRecord(payload);
  const response = source.response ?? source.data ?? payload;
  const record = Array.isArray(response) ? {} : asRecord(response);
  const questions = Array.isArray(response)
    ? response
    : Array.isArray(record.questions)
      ? record.questions
      : [];
  const student = asRecord(record.student);
  const firstQuestion = asRecord(questions[0]);
  const resolvedAssessmentId = String(
    record.id ?? firstQuestion.assessmentId ?? resolveAssessmentId("1")
  );
  const gradeId = toNumericId(record.gradeId ?? firstQuestion.gradeId);
  const fallbackDuration = Number(record.durationMinutes ?? firstQuestion.durationMinutes ?? 45);

  return {
    id: resolvedAssessmentId,
    attemptId: String(record.attemptId ?? resolvedAssessmentId),
    title: String(record.title ?? record.assessmentName ?? "PARAKH LAT Assessment"),
    grade: String(record.grade ?? ""),
    gradeId: gradeId || undefined,
    subject: String(record.subject ?? ""),
    topic: record.topic ? String(record.topic) : undefined,
    durationMinutes: getDurationMinutesByGradeId(gradeId, fallbackDuration),
    student: {
      name: String(student.name ?? "Student"),
      rollNumber: String(student.rollNumber ?? "")
    },
    questions: questions.map(normalizeQuestion)
  };
}

function delay(ms = 300) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildSubmitPayload(assessmentId: string, payload: AssessmentAnswerPayload) {
  return {
    assessmentId: resolveAssessmentId(payload.assessmentId ?? assessmentId),
    answers: payload.answers
      .filter((answer) => answer.selectedOptionId)
      .map((answer) => ({
        questionId: toNumericId(answer.questionId),
        optionId: toNumericId(answer.selectedOptionId)
      }))
      .filter((answer) => answer.questionId > 0 && answer.optionId > 0)
  };
}

export const assessmentApi = {
  async checkAssessmentAvailability() {
    const response = await latApiClient.get<LatApiEnvelope<unknown> | string>("/check-assessment", {
      headers: {
        accept: "text/plain"
      }
    });
    const data = parseLatEnvelope(response.data);

    return normalizeAssessmentAvailability(data);
  },

  async getAssessment() {
    const response = await latApiClient.get<LatApiEnvelope<unknown> | string>("/questions", {
      headers: {
        accept: "text/plain"
      }
    });
    const data = parseLatEnvelope(response.data, { allowPlainTextSuccess: true });

    if (data.status !== 1) {
      throw new Error(data.message || "Unable to load assessment questions");
    }

    return normalizeAssessment(data);
  },

  async saveAttempt(attemptId: string, payload: AssessmentAnswerPayload) {
    // Real API:
    // const response = await axiosClient.post(`/student/attempts/${attemptId}/save`, payload);
    // return response.data;

    await delay(150);
    return { ok: true, attemptId, savedAnswers: payload.answers.length };
  },

  async submitAttempt(attemptId: string, payload: AssessmentAnswerPayload) {
    const response = await latApiClient.post<LatApiEnvelope<unknown> | string>(
      "/submit-assessment",
      buildSubmitPayload(attemptId, payload),
      {
        headers: {
          accept: "text/plain"
        }
      }
    );
    const data = parseLatEnvelope(response.data);

    if (data.status !== 1) {
      throw new Error(data.message || "Unable to submit assessment");
    }

    return data;
  }
};
