import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_PERMISSIONS_COOKIE_NAME,
  AUTH_ROLES_COOKIE_NAME,
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME
} from "@/features/auth/constants/auth.constants";
import { mapRoleIdToRoleCode } from "@/features/auth/utils/role-routing";
import { ROLE_PERMISSION_MAP } from "@/shared/constants/rbac";
import { serializePermissions } from "@/shared/lib/rbac";
import type { LatLoginUser } from "@/features/auth/types/auth.types";
import type { RoleCode } from "@/shared/types/rbac";

type AuthSessionRequest = {
  rememberMe?: boolean;
  roleCode?: RoleCode;
  roleId?: number;
  token?: string;
  userDetail?: LatLoginUser;
};

function cookieOptions(maxAge: number, httpOnly: boolean) {
  return {
    httpOnly,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as AuthSessionRequest;

  if (!body.token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const maxAge = body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const roleCode = body.roleCode ?? mapRoleIdToRoleCode(body.roleId);
  const permissions = ROLE_PERMISSION_MAP[roleCode] ?? [];
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_TOKEN_COOKIE_NAME,
    value: body.token,
    ...cookieOptions(maxAge, false)
  });

  if (body.userDetail) {
    response.cookies.set({
      name: AUTH_USER_COOKIE_NAME,
      value: JSON.stringify(body.userDetail),
      ...cookieOptions(maxAge, false)
    });
  }

  response.cookies.set({
    name: AUTH_ROLES_COOKIE_NAME,
    value: roleCode,
    ...cookieOptions(maxAge, true)
  });
  response.cookies.set({
    name: AUTH_PERMISSIONS_COOKIE_NAME,
    value: serializePermissions(permissions),
    ...cookieOptions(maxAge, false)
  });

  return response;
}
