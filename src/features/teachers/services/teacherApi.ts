import { latApiClient } from "@/shared/lib/latApiClient";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type { CreateTeacherPayload, Teacher } from "../types/teacher.types";

type TeacherResponse = Record<string, unknown>;

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

export const teacherApi = {
  async list() {
    const response = await latApiClient.get<unknown>("/teachers");
    return unwrapTeacherList(response.data);
  },

  async create(payload: CreateTeacherPayload) {
    const response = await latApiClient.post<LatApiEnvelope<unknown>>("/add-user", payload);

    if (response.data.status !== 1) {
      throw new Error(response.data.message || "Unable to create teacher");
    }

    return normalizeTeacher(response.data.response ?? payload);
  }
};
