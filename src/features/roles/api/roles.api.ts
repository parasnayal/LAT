import { latApiClient } from "@/shared/lib/latApiClient";
import type { RbacListParams, RbacListResponse, Role } from "@/shared/types/rbac";
import type { EntityStatus, PermissionCode, RoleCode } from "@/shared/types/rbac";

export type RoleOption = {
  id: number;
  name: string;
};

type LatRoleRecord = {
  id?: number;
  name?: string;
};

type LatRolesEnvelope = {
  response?: unknown;
};

function toRoleCode(name: string): RoleCode {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  const roleCodeMap: Record<string, RoleCode> = {
    admin: "admin",
    reviewer: "reviewer",
    student: "student",
    teacher: "teacher"
  };

  return roleCodeMap[normalized] ?? "admin";
}

function unwrapRoles(data: unknown): RoleOption[] {
  const envelope = data && typeof data === "object" ? (data as LatRolesEnvelope) : null;
  const response = envelope?.response ?? data;

  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .map((item) => {
      const record = item && typeof item === "object" ? (item as LatRoleRecord) : {};

      return {
        id: Number(record.id ?? 0),
        name: String(record.name ?? "")
      };
    })
    .filter((role) => role.id > 0 && role.name);
}

function toRole(option: RoleOption): Role {
  const now = new Date().toISOString();

  return {
    id: String(option.id),
    code: toRoleCode(option.name),
    name: option.name,
    description: `${option.name} role from LAT roles API.`,
    status: "active" satisfies EntityStatus,
    permissionCodes: [] satisfies PermissionCode[],
    userCount: 0,
    createdAt: now,
    updatedAt: now,
    auditHistory: [
      {
        id: `${option.id}-api-sync`,
        action: "Synced from LAT API",
        actorName: "System",
        timestamp: now,
        details: "Loaded from /api/LAT/roles"
      }
    ]
  };
}

function filterRoles(roles: Role[], params: RbacListParams) {
  const search = params.search?.trim().toLowerCase();
  const status = params.status && params.status !== "all" ? params.status : undefined;

  return roles.filter((role) => {
    const matchesSearch =
      !search ||
      role.name.toLowerCase().includes(search) ||
      role.description.toLowerCase().includes(search);
    const matchesStatus = !status || role.status === status;

    return matchesSearch && matchesStatus;
  });
}

export const rolesApi = {
  async list(params: RbacListParams) {
    const response = await latApiClient.get<unknown>("/roles");
    const roles = filterRoles(unwrapRoles(response.data).map(toRole), params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? roles.length;
    const start = (page - 1) * pageSize;

    return {
      items: roles.slice(start, start + pageSize),
      page,
      pageSize,
      total: roles.length
    } satisfies RbacListResponse<Role>;
  },

  async options() {
    const response = await latApiClient.get<unknown>("/roles");
    return unwrapRoles(response.data);
  }
};
