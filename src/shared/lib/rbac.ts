import type { PermissionCode, RoleCode } from "@/shared/types/rbac";
import { ROLE_PERMISSION_MAP } from "@/shared/constants/rbac";

export function getRolePermissions(roleCodes: RoleCode[]) {
  return Array.from(new Set(roleCodes.flatMap((roleCode) => ROLE_PERMISSION_MAP[roleCode] ?? [])));
}

export function hasPermission(
  userPermissions: PermissionCode[],
  requiredPermission?: PermissionCode
) {
  if (!requiredPermission) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: PermissionCode[],
  requiredPermissions: PermissionCode[]
) {
  return (
    requiredPermissions.length === 0 ||
    requiredPermissions.some((permission) => userPermissions.includes(permission))
  );
}

export function hasAllPermissions(
  userPermissions: PermissionCode[],
  requiredPermissions: PermissionCode[]
) {
  return requiredPermissions.every((permission) => userPermissions.includes(permission));
}

export function serializePermissions(permissionCodes: PermissionCode[]) {
  return permissionCodes.join(",");
}

export function parseSerializedPermissions(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((permission) => permission.trim())
    .filter(Boolean) as PermissionCode[];
}
