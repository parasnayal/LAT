import { latApiClient } from "@/shared/lib/latApiClient";
import { readAuthUser } from "@/features/auth/utils/auth-cookies";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type { CreateStudentPayload, Student } from "../types/student.types";

type StudentResponse = Record<string, unknown>;

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

function unwrapStudentList(data: LatApiEnvelope<unknown> | string) {
  const parsed = parseEnvelope(data);
  const response = parsed.response;

  if (parsed.status !== 1) {
    throw new Error(parsed.message || "Unable to load students");
  }

  if (!Array.isArray(response)) {
    return [];
  }

  console.log(response, "responseresponse");

  return response.map(normalizeStudent);
}

function normalizeStudent(item: unknown): Student {
  const record = item && typeof item === "object" ? (item as StudentResponse) : {};

  return {
    id: String(record.id ?? record.studentId ?? crypto.randomUUID()),
    studentName: String(record.studentName ?? record.fullName ?? record.name ?? ""),
    email: String(record.email ?? ""),
    // dob: String(record.dob ?? record.dateOfBirth ?? ""),
    grade: String(record.grade ?? record.gradeName ?? ""),
    gradeId: record.gradeId ? Number(record.gradeId) : undefined,
    region: String(record.region ?? record.regionName ?? ""),
    regionId: record.regionId ? Number(record.regionId) : undefined,
    school: String(record.school ?? record.schoolName ?? ""),
    // schoolId: record.schoolId ? Number(record.schoolId) : undefined,
    subject: record.subject ? String(record.subject) : undefined,
    // subjectId: record.subjectId ? Number(record.subjectId) : undefined,
    mobileNumber: record.mobileNumber
      ? String(record.mobileNumber)
      : String(record.contactNo ?? ""),
    rollNumber: String(record.rollNumber ?? record.rollNo ?? "")
    // createdAt: String(record.createdAt ?? record.createdDate ?? new Date().toISOString())
  };
}

function getCreatedByUserId() {
  const authUser = readAuthUser();
  return Number(authUser?.id ?? authUser?.userId ?? 0);
}

export const studentApi = {
  async list() {
    const response = await latApiClient.get<LatApiEnvelope<unknown> | string>("/students", {
      headers: {
        accept: "text/plain"
      }
    });

    console.log(response, "response");

    return unwrapStudentList(response.data);
  },

  async create(payload: CreateStudentPayload) {
    const response = await latApiClient.post<LatApiEnvelope<unknown> | string>(
      "/add-student",
      {
        studentName: payload.studentName,
        email: payload.email,
        fatherName: "",
        gender: 1,
        gradeId: payload.gradeId,
        section: "A",
        rollNo: payload.rollNumber,
        schoolId: payload.schoolId,
        regionId: payload.regionId,
        createdBy: getCreatedByUserId()
      },
      {
        headers: {
          accept: "text/plain"
        }
      }
    );
    const data = parseEnvelope(response.data);

    if (data.status !== 1) {
      throw new Error(data.message || "Unable to create student");
    }

    return normalizeStudent(data.response ?? payload);
  }
};
