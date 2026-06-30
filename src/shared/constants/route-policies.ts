import { RBAC_PERMISSIONS } from "@/shared/constants/rbac";
import type { PermissionCode, RoleCode } from "@/shared/types/rbac";

export type RoutePolicy = {
  pattern: string;
  requiredPermissions: PermissionCode[];
  allowedRoles?: RoleCode[];
};

export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/users",
  "/roles",
  "/permissions",
  "/admin",
  "/teacher",
  "/student",
  "/reviewer",
  "/curriculum",
  "/questions",
  "/assessments",
  "/analytics",
  "/reports"
] as const;

export const PUBLIC_ROUTE_PREFIXES = ["/login"] as const;

export const ROUTE_POLICIES: RoutePolicy[] = [
  { pattern: "/users", requiredPermissions: [RBAC_PERMISSIONS.userView] },
  { pattern: "/roles", requiredPermissions: [RBAC_PERMISSIONS.roleView] },
  { pattern: "/permissions", requiredPermissions: [RBAC_PERMISSIONS.permissionView] },
  { pattern: "/settings", requiredPermissions: [RBAC_PERMISSIONS.settingsManage] },
  { pattern: "/curriculum/competencies", requiredPermissions: [RBAC_PERMISSIONS.competencyView] },
  { pattern: "/curriculum", requiredPermissions: [RBAC_PERMISSIONS.curriculumView] },
  {
    pattern: "/admin/question-generator",
    requiredPermissions: [RBAC_PERMISSIONS.questionGenerate]
  },
  { pattern: "/admin/teachers", requiredPermissions: [RBAC_PERMISSIONS.teacherManage] },
  {
    pattern: "/teacher/students",
    requiredPermissions: [RBAC_PERMISSIONS.studentCreate],
    allowedRoles: ["teacher"]
  },
  {
    pattern: "/student/test",
    requiredPermissions: [RBAC_PERMISSIONS.assessmentAttempt],
    allowedRoles: ["admin", "super_admin", "student"]
  },
  { pattern: "/reviewer/questions", requiredPermissions: [RBAC_PERMISSIONS.questionReview] },
  { pattern: "/questions", requiredPermissions: [RBAC_PERMISSIONS.questionView] },
  { pattern: "/assessments", requiredPermissions: [RBAC_PERMISSIONS.assessmentView] },
  {
    pattern: "/reports",
    requiredPermissions: [RBAC_PERMISSIONS.reportView],
    allowedRoles: ["admin", "super_admin"]
  },
  { pattern: "/analytics", requiredPermissions: [RBAC_PERMISSIONS.analyticsView] }
];

export function getRoutePolicy(pathname: string) {
  return [...ROUTE_POLICIES]
    .sort((first, second) => second.pattern.length - first.pattern.length)
    .find((policy) => pathname === policy.pattern || pathname.startsWith(`${policy.pattern}/`));
}
