export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "assign"
  | "generate"
  | "review"
  | "approve"
  | "reject"
  | "publish"
  | "manage"
  | "upload"
  | "schedule"
  | "attempt"
  | "download";

export type PermissionResource =
  | "user"
  | "role"
  | "permission"
  | "organization"
  | "school"
  | "teacher"
  | "reviewer"
  | "curriculum"
  | "grade"
  | "subject"
  | "chapter"
  | "learningOutcome"
  | "learningIndicator"
  | "competency"
  | "question"
  | "assessment"
  | "student"
  | "report"
  | "analytics"
  | "settings";

export type PermissionCode = `${PermissionResource}.${PermissionAction}`;

export type RoleCode =
  | "super_admin"
  | "organization_admin"
  | "curriculum_manager"
  | "question_author"
  | "reviewer"
  | "assessment_manager"
  | "teacher"
  | "student"
  | "regional_officer";

export type EntityStatus = "active" | "inactive" | "draft" | "archived";

export type AuditEvent = {
  id: string;
  action: string;
  actorName: string;
  timestamp: string;
  details: string;
};

export type Permission = {
  id: string;
  code: PermissionCode;
  name: string;
  resource: PermissionResource;
  action: PermissionAction;
  description: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  auditHistory: AuditEvent[];
};

export type Role = {
  id: string;
  code: RoleCode;
  name: string;
  description: string;
  status: EntityStatus;
  permissionCodes: PermissionCode[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
  auditHistory: AuditEvent[];
};

export type RbacUser = {
  id: string;
  name: string;
  email: string;
  organizationName: string;
  schoolName?: string;
  roleCodes: RoleCode[];
  permissionCodes: PermissionCode[];
  status: "active" | "invited" | "suspended";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  auditHistory: AuditEvent[];
};

export type RbacListParams = {
  search?: string;
  status?: string;
  role?: string;
  resource?: string;
  page?: number;
  pageSize?: number;
};

export type RbacListResponse<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
};
