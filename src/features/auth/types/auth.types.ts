import type { RoleCode } from "@/shared/types/rbac";

export type UserRole = "admin" | "reviewer" | "teacher" | "student" | "manager" | "member";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleId?: number;
  fullName?: string;
};

export type LoginRequest = {
  userName?: string;
  email?: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  user: AuthUser;
  latUser: LatLoginUser;
  accessToken: string;
  roleCode?: RoleCode;
};

export type LatLoginUser = {
  token?: string;
  id?: number;
  userId?: number;
  userName?: string;
  fullName?: string;
  roleId?: number;
  genderId?: number;
  genderName?: string;
  email?: string;
  schoolId?: number | null;
  schoolName?: string | null;
  regionId?: number | null;
  regionName?: string | null;
  contactNo?: string | null;
};

export type LatLoginApiResponse = {
  status: number;
  errorCode?: string;
  message?: string;
  response?: LatLoginUser;
};
