import { latApiClient } from "@/shared/lib/latApiClient";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type { CreateStudentPayload, Student } from "../types/student.types";

type StudentResponse = Record<string, unknown>;
const STUDENT_STORAGE_KEY = "lat-demo-students";

function normalizeStudent(item: unknown): Student {
  const record = item && typeof item === "object" ? (item as StudentResponse) : {};

  return {
    id: String(record.id ?? crypto.randomUUID()),
    studentName: String(record.studentName ?? ""),
    dob: String(record.dob ?? ""),
    grade: String(record.grade ?? record.gradeName ?? ""),
    gradeId: record.gradeId ? Number(record.gradeId) : undefined,
    region: String(record.region ?? record.regionName ?? ""),
    school: String(record.school ?? record.schoolName ?? ""),
    schoolId: record.schoolId ? Number(record.schoolId) : undefined,
    subject: record.subject ? String(record.subject) : undefined,
    subjectId: record.subjectId ? Number(record.subjectId) : undefined,
    mobileNumber: record.mobileNumber ? String(record.mobileNumber) : "",
    rollNumber: String(record.rollNumber ?? record.rollNo ?? ""),
    createdAt: String(record.createdAt ?? new Date().toISOString())
  };
}

function readStoredStudents() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawStudents = window.localStorage.getItem(STUDENT_STORAGE_KEY);
  return rawStudents ? (JSON.parse(rawStudents) as Student[]) : [];
}

function writeStoredStudents(students: Student[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
}

export const studentApi = {
  async list() {
    // Swagger currently exposes /api/LAT/add-student for create, but no student list endpoint.
    // const response = await axiosClient.get<unknown>("/students");
    // const data = Array.isArray(response.data) ? response.data : [];
    // return data.map(normalizeStudent);

    return readStoredStudents();
  },

  async create(payload: CreateStudentPayload) {
    const response = await latApiClient.post<LatApiEnvelope<unknown>>("/add-student", {
      studentName: payload.studentName,
      fatherName: "",
      gender: 1,
      gradeId: payload.gradeId,
      section: "A",
      rollNo: payload.rollNumber,
      schoolId: payload.schoolId,
      createdBy: 1
    });

    if (response.data.status !== 1) {
      throw new Error(response.data.message || "Unable to create student");
    }

    const student = normalizeStudent({
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    });
    writeStoredStudents([student, ...readStoredStudents()]);
    return student;
  }
};
