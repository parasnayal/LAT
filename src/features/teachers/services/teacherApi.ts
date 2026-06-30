import axios from "axios";
import { readAuthUser } from "@/features/auth/utils/auth-cookies";
import { latApiClient } from "@/shared/lib/latApiClient";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type { CreateTeacherPayload, Teacher } from "../types/teacher.types";

type TeacherResponse = Record<string, unknown>;

function parseEnvelope(data: LatApiEnvelope<unknown> | string): LatApiEnvelope<unknown> {
  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data) as LatApiEnvelope<unknown>;
  } catch {
    return {
      status: 0,
      message: data
    };
  }
}

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const parsed = typeof data === "string" ? parseEnvelope(data) : data;

    if (parsed && typeof parsed === "object") {
      const record = parsed as { message?: unknown; error?: unknown; title?: unknown };
      return String(record.message ?? record.error ?? record.title ?? error.message);
    }

    return error.message;
  }

  return error instanceof Error ? error.message : "Unable to create teacher";
}

function normalizeTeacher(item: unknown): Teacher {
  const record = item && typeof item === "object" ? (item as TeacherResponse) : {};
  const fullName = String(record.fullName ?? record.teacherName ?? record.userName ?? "");

  return {
    id: String(record.id ?? record.userId ?? crypto.randomUUID()),
    userName: String(record.userName ?? ""),
    teacherName: fullName,
    email: String(record.email ?? ""),
    roleId: record.roleId ? Number(record.roleId) : undefined,
    region: String(record.region ?? record.regionName ?? ""),
    regionId: record.regionId ? Number(record.regionId) : undefined,
    school: String(record.school ?? record.schoolName ?? ""),
    schoolId: record.schoolId ? Number(record.schoolId) : undefined,
    contactNumber: String(record.contactNumber ?? record.contactNo ?? ""),
    createdAt: String(record.createdAt ?? new Date().toISOString())
  };
}

function unwrapTeacherList(data: unknown) {
  const envelope = data && typeof data === "object" ? (data as LatApiEnvelope<unknown>) : null;
  const response = envelope?.response ?? data;

  if (Array.isArray(response)) {
    return response.map(normalizeTeacher);
  }

  return [];
}

function getCreatedByUserId() {
  const authUser = readAuthUser();
  return Number(authUser?.id ?? authUser?.userId ?? 0);
}

export const teacherApi = {
  async list() {
    const response = await latApiClient.get<unknown>("/teachers");
    return unwrapTeacherList(response.data);
  },

  async create(payload: CreateTeacherPayload) {
    try {
      const response = await latApiClient.post<LatApiEnvelope<unknown> | string>("/add-user", {
        ...payload,
        createdBy: getCreatedByUserId()
      });
      const data = parseEnvelope(response.data);

      if (data.status !== 1) {
        throw new Error(data.message || "Unable to create teacher");
      }

      return normalizeTeacher(data.response ?? payload);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
};
