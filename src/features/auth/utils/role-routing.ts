import type { UserRole } from "../types/auth.types";
import type { RoleCode } from "@/shared/types/rbac";

export function mapRoleIdToRoleCode(roleId?: number): RoleCode {
  if (roleId === 1) {
    return "admin";
  }

  if (roleId === 2) {
    return "reviewer";
  }

  if (roleId === 3) {
    return "teacher";
  }

  if (roleId === 4) {
    return "student";
  }

  return "admin";
}

export function mapRoleIdToUserRole(roleId?: number): UserRole {
  if (roleId === 2) {
    return "reviewer";
  }

  if (roleId === 3) {
    return "teacher";
  }

  if (roleId === 4) {
    return "student";
  }

  return "admin";
}

export function getDefaultRouteForRole(roleCode?: RoleCode | string) {
  if (roleCode === "reviewer") {
    return "/reviewer/questions";
  }

  if (roleCode === "teacher") {
    return "/teacher/students";
  }

  if (roleCode === "student") {
    return "/student/test/demo-assessment";
  }

  return "/dashboard";
}
