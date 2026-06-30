export type Student = {
  id: string;
  studentName: string;
  email: string;
  dob: string;
  grade: string;
  gradeId?: number;
  region?: string;
  regionId?: number;
  school?: string;
  schoolId?: number;
  subject?: string;
  subjectId?: number;
  mobileNumber?: string;
  rollNumber: string;
  createdAt: string;
};

export type CreateStudentPayload = {
  studentName: string;
  email: string;
  dob: string;
  grade: string;
  gradeId: number;
  region: string;
  regionId: number;
  school: string;
  schoolId: number;
  subject?: string;
  subjectId?: number;
  mobileNumber?: string;
  rollNumber: string;
};

export type StudentFilters = {
  grade?: string;
  search?: string;
};
