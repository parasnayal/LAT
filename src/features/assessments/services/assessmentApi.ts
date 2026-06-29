import { latApiClient } from "@/shared/lib/latApiClient";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type { AssessmentListItem } from "../types/assessment.types";

type AssessmentResponse = Record<string, unknown>;

function toRecord(item: unknown): AssessmentResponse {
  return item && typeof item === "object" ? (item as AssessmentResponse) : {};
}

function readString(record: AssessmentResponse, key: string) {
  const value = record[key];
  return value === null || value === undefined ? "" : String(value);
}

function readNumber(record: AssessmentResponse, key: string) {
  const value = Number(record[key] ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function normalizeAssessment(item: unknown): AssessmentListItem {
  const record = toRecord(item);

  return {
    id: readString(record, "id") || crypto.randomUUID(),
    assessmentName: readString(record, "assessmentName") || "Untitled assessment",
    description: readString(record, "description"),
    educationStage: readString(record, "educationStage"),
    grade: readString(record, "grade"),
    subject: readString(record, "subject"),
    questionType: readString(record, "questionType"),
    totalQuestions: readNumber(record, "totalQuestions"),
    totalMarks: readNumber(record, "totalMarks"),
    durationMinutes: readNumber(record, "durationMinutes"),
    difficultyLevel: readString(record, "difficultyLevel"),
    assessmentDate: readString(record, "assessmentDate"),
    status: readString(record, "status"),
    createdDate: readString(record, "createdDate")
  };
}

function unwrapAssessmentList(data: unknown) {
  const envelope = data && typeof data === "object" ? (data as LatApiEnvelope<unknown>) : null;
  const response = envelope?.response ?? data;

  if (Array.isArray(response)) {
    return response.map(normalizeAssessment);
  }

  return [];
}

function isLatEnvelope(data: unknown): data is LatApiEnvelope<unknown> {
  return Boolean(data && typeof data === "object" && "status" in data);
}

export const assessmentApi = {
  async list() {
    const response = await latApiClient.get<LatApiEnvelope<unknown>>("/assessment-list");

    if (response.data.status !== 1) {
      throw new Error(response.data.message || "Unable to load assessments");
    }

    return unwrapAssessmentList(response.data);
  },

  async publish(assessmentId: string) {
    const response = await latApiClient.post<LatApiEnvelope<unknown> | string>(
      "/publish-assessment",
      undefined,
      {
        headers: {
          accept: "text/plain"
        },
        params: {
          assessmentId
        }
      }
    );

    if (isLatEnvelope(response.data)) {
      if (response.data.status !== 1) {
        throw new Error(response.data.message || "Unable to start assessment");
      }

      return response.data.message || "Assessment started";
    }

    return response.data.trim() || "Assessment started";
  }
};
