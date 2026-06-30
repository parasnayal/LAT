import {
  ALL_PERMISSION_CODES,
  RBAC_PERMISSIONS,
  ROLE_LABELS,
  ROLE_PERMISSION_MAP
} from "@/shared/constants/rbac";
import type {
  AuditEvent,
  Permission,
  PermissionAction,
  PermissionCode,
  PermissionResource,
  RbacListParams,
  RbacListResponse,
  RbacUser,
  Role,
  RoleCode
} from "@/shared/types/rbac";

const now = "2026-06-25T05:00:00.000Z";

const audit = (action: string, actorName = "System Admin"): AuditEvent[] => [
  {
    id: crypto.randomUUID(),
    action,
    actorName,
    timestamp: now,
    details: `${action} during RBAC bootstrap`
  }
];

function splitPermission(code: PermissionCode) {
  const [resource, action] = code.split(".") as [PermissionResource, PermissionAction];
  return { resource, action };
}

export const mockPermissions: Permission[] = ALL_PERMISSION_CODES.map((code) => {
  const { resource, action } = splitPermission(code);

  return {
    id: `perm_${code.replace(".", "_")}`,
    code,
    name: code
      .split(".")
      .map((part) => part.replace(/([A-Z])/g, " $1"))
      .join(" ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    resource,
    action,
    description: `Allows ${action} access for ${resource} workflows.`,
    status: "active",
    createdAt: now,
    updatedAt: now,
    auditHistory: audit("Permission seeded")
  };
});

export const mockRoles: Role[] = (Object.keys(ROLE_LABELS) as RoleCode[]).map((code, index) => ({
  id: `role_${index + 1}`,
  code,
  name: ROLE_LABELS[code],
  description: getRoleDescription(code),
  status: "active",
  permissionCodes: ROLE_PERMISSION_MAP[code],
  userCount: [2, 8, 5, 16, 10, 4, 62, 280, 7][index] ?? 0,
  createdAt: now,
  updatedAt: now,
  auditHistory: audit("Role configured")
}));

export const mockUsers: RbacUser[] = [
  createUser(
    "usr_1",
    "Ananya Rao",
    "ananya.rao@parakh.gov.in",
    ["super_admin"],
    "National PARAKH Cell"
  ),
  createUser(
    "usr_2",
    "Maya Patel",
    "maya.patel@stateboard.gov.in",
    ["organization_admin"],
    "State Assessment Board"
  ),
  createUser(
    "usr_3",
    "Kabir Mehta",
    "kabir.mehta@curriculum.gov.in",
    ["curriculum_manager"],
    "State Curriculum Unit"
  ),
  createUser(
    "usr_4",
    "Nisha Singh",
    "nisha.singh@school.edu.in",
    ["question_author"],
    "Delhi School Network",
    "Model School 12"
  ),
  createUser(
    "usr_5",
    "Farhan Ali",
    "farhan.ali@review.edu.in",
    ["reviewer"],
    "Delhi School Network"
  ),
  createUser(
    "usr_6",
    "Isha Menon",
    "isha.menon@assessment.gov.in",
    ["assessment_manager"],
    "Assessment Operations"
  ),
  createUser(
    "usr_7",
    "Dev Sharma",
    "dev.sharma@school.edu.in",
    ["teacher"],
    "Delhi School Network",
    "Model School 12"
  ),
  createUser(
    "usr_8",
    "Riya Kapoor",
    "riya.kapoor@student.edu.in",
    ["student"],
    "Delhi School Network",
    "Model School 12"
  ),
  createUser(
    "usr_9",
    "Arvind Bose",
    "arvind.bose@region.gov.in",
    ["regional_officer"],
    "North Regional Office"
  )
];

export function filterAndPaginate<TItem extends { status: string }>(
  items: TItem[],
  params: RbacListParams,
  matcher: (item: TItem, search: string) => boolean
): RbacListResponse<TItem> {
  const search = params.search?.toLowerCase().trim() ?? "";
  const page = Number(params.page ?? 1);
  const pageSize = Number(params.pageSize ?? 6);
  const filtered = items.filter((item) => {
    const matchesSearch = search ? matcher(item, search) : true;
    const matchesStatus =
      params.status && params.status !== "all" ? item.status === params.status : true;
    return matchesSearch && matchesStatus;
  });
  const offset = (page - 1) * pageSize;

  return {
    items: filtered.slice(offset, offset + pageSize),
    page,
    pageSize,
    total: filtered.length
  };
}

function createUser(
  id: string,
  name: string,
  email: string,
  roleCodes: RoleCode[],
  organizationName: string,
  schoolName?: string
): RbacUser {
  return {
    id,
    name,
    email,
    organizationName,
    schoolName,
    roleCodes,
    permissionCodes: Array.from(
      new Set(roleCodes.flatMap((roleCode) => ROLE_PERMISSION_MAP[roleCode]))
    ),
    status: id === "usr_8" ? "invited" : "active",
    lastLoginAt: id === "usr_8" ? undefined : now,
    createdAt: now,
    updatedAt: now,
    auditHistory: audit("User provisioned")
  };
}

function getRoleDescription(code: RoleCode) {
  const descriptions: Record<RoleCode, string> = {
    admin: "Full platform administration mapped from the LAT Admin role.",
    super_admin:
      "Full platform administration across organizations, users, permissions, settings, and analytics.",
    organization_admin:
      "Manages schools, teachers, reviewers, assessments, and organization-level reporting.",
    curriculum_manager:
      "Owns grades, subjects, chapters, learning outcomes, indicators, and competencies.",
    question_author:
      "Generates AI questions, creates manual questions, saves drafts, and submits for review.",
    reviewer: "Reviews, edits, approves, rejects, comments on, and publishes questions.",
    assessment_manager:
      "Creates assessments, selects questions, configures blueprints, publishes, and schedules.",
    teacher:
      "Assigns assessments and views student performance, competency reports, and downloads.",
    student: "Attempts assigned assessments and views results and feedback.",
    regional_officer: "Reviews district and school reports, comparisons, and competency analytics."
  };

  return descriptions[code];
}

export const roleFilterOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label
}));
export const permissionResourceOptions = Array.from(
  new Set(mockPermissions.map((permission) => permission.resource))
).map((resource) => ({
  value: resource,
  label: resource.replace(/([A-Z])/g, " $1").replace(/\b\w/g, (letter) => letter.toUpperCase())
}));
export const defaultAdminRolePermissions = ROLE_PERMISSION_MAP.super_admin;
export const defaultCurriculumManagerPermissions = ROLE_PERMISSION_MAP.curriculum_manager;
export const defaultAssessmentManagerPermissions = ROLE_PERMISSION_MAP.assessment_manager;
export const keyPermissions = RBAC_PERMISSIONS;
