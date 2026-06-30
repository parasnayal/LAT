import { AUTH_TOKEN_COOKIE_NAME, AUTH_USER_COOKIE_NAME } from "../constants/auth.constants";
import type { LatLoginUser } from "../types/auth.types";

export function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? null
  );
}

export function readAuthToken() {
  const token = readCookie(AUTH_TOKEN_COOKIE_NAME);
  return token ? decodeURIComponent(token) : null;
}

export function readAuthUser() {
  const userDetail = readCookie(AUTH_USER_COOKIE_NAME);

  if (!userDetail) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(userDetail)) as LatLoginUser;
  } catch {
    return null;
  }
}
