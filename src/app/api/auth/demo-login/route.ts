import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_PERMISSIONS_COOKIE_NAME,
  AUTH_ROLES_COOKIE_NAME
} from "@/features/auth/constants/auth.constants";
import { mapRoleIdToRoleCode } from "@/features/auth/utils/role-routing";
import { ROLE_PERMISSION_MAP } from "@/shared/constants/rbac";
import { serializePermissions } from "@/shared/lib/rbac";
import type { RoleCode } from "@/shared/types/rbac";

type DemoLoginRequest = {
  rememberMe?: boolean;
  roleCode?: RoleCode;
  roleId?: number;
  token?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as DemoLoginRequest;
  const maxAge = body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const roleCode = body.roleCode ?? mapRoleIdToRoleCode(body.roleId);
  const permissions = ROLE_PERMISSION_MAP[roleCode] ?? [];
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: body.token ?? "demo-session",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  });
  response.cookies.set({
    name: AUTH_ROLES_COOKIE_NAME,
    value: roleCode,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  });
  response.cookies.set({
    name: AUTH_PERMISSIONS_COOKIE_NAME,
    value: serializePermissions(permissions),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  });

  return response;
}
