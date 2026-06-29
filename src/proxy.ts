import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_PERMISSIONS_COOKIE_NAME,
  AUTH_ROLES_COOKIE_NAME
} from "@/features/auth/constants/auth.constants";
import {
  getRoutePolicy,
  PROTECTED_ROUTE_PREFIXES,
  PUBLIC_ROUTE_PREFIXES
} from "@/shared/constants/route-policies";
import { ROUTES } from "@/shared/constants/routes";
import { hasAllPermissions, parseSerializedPermissions } from "@/shared/lib/rbac";

function parseSerializedRoles(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookieName = process.env.AUTH_COOKIE_NAME ?? AUTH_COOKIE_NAME;
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
  const hasSession = Boolean(request.cookies.get(authCookieName)?.value);

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedRoute && hasSession) {
    const policy = getRoutePolicy(pathname);
    const permissions = parseSerializedPermissions(
      request.cookies.get(AUTH_PERMISSIONS_COOKIE_NAME)?.value
    );
    const roles = parseSerializedRoles(request.cookies.get(AUTH_ROLES_COOKIE_NAME)?.value);

    if (policy && !hasAllPermissions(permissions, policy.requiredPermissions)) {
      return NextResponse.redirect(new URL(ROUTES.forbidden, request.url));
    }

    if (policy?.allowedRoles?.length && !policy.allowedRoles.some((role) => roles.includes(role))) {
      return NextResponse.redirect(new URL(ROUTES.forbidden, request.url));
    }
  }

  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/roles/:path*",
    "/permissions/:path*",
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/reviewer/:path*",
    "/curriculum/:path*",
    "/questions/:path*",
    "/assessments/:path*",
    "/analytics/:path*",
    "/login"
  ]
};
