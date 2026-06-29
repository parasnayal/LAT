import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_PERMISSIONS_COOKIE_NAME,
  AUTH_ROLES_COOKIE_NAME
} from "@/features/auth/constants/auth.constants";

const AUTH_COOKIE_NAMES = [
  AUTH_COOKIE_NAME,
  AUTH_PERMISSIONS_COOKIE_NAME,
  AUTH_ROLES_COOKIE_NAME
] as const;

export function POST() {
  const response = NextResponse.json({ ok: true });

  AUTH_COOKIE_NAMES.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });
  });

  return response;
}
