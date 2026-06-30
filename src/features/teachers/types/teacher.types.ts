export type Teacher = {
  id: string;
  userName: string;
  teacherName: string;
  email: string;
  roleId?: number;
  region: string;
  regionId?: number;
  school: string;
  schoolId?: number;
  contactNumber: string;
  createdAt: string;
};

export type CreateTeacherPayload = {
  userName: string;
  fullName: string;
  email: string;
  roleId: number;
  schoolId: number;
  contactNumber: string;
};

export type TeacherFilters = {
  regionId?: number;
  search?: string;
};
