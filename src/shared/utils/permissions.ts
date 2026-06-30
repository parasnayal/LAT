"use client";

import { AUTH_PERMISSIONS_COOKIE_NAME } from "@/features/auth/constants/auth.constants";
import type { PermissionCode } from "@/shared/types/rbac";
import { useMemo, useState } from "react";

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

export function getClientPermissions() {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = readCookie(AUTH_PERMISSIONS_COOKIE_NAME);

  return decodeURIComponent(stored)
    .split(",")
    .map((permission) => permission.trim())
    .filter(Boolean) as PermissionCode[];
}

export function can(permission: PermissionCode) {
  return getClientPermissions().includes(permission);
}

export function canAny(permissions: PermissionCode[]) {
  return permissions.length === 0 || permissions.some((permission) => can(permission));
}

export function useClientPermissions() {
  const [permissions] = useState<PermissionCode[]>(() => getClientPermissions());

  return useMemo(
    () => ({
      permissions,
      can: (permission: PermissionCode) => permissions.includes(permission),
      canAny: (requiredPermissions: PermissionCode[]) =>
        requiredPermissions.length === 0 ||
        requiredPermissions.some((permission) => permissions.includes(permission))
    }),
    [permissions]
  );
}
