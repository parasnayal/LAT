export const AUTH_COOKIE_NAME = "lat_session";
export const AUTH_PERMISSIONS_COOKIE_NAME = "lat_permissions";
export const AUTH_ROLES_COOKIE_NAME = "lat_roles";

export const PUBLIC_ROUTES = ["/login"] as const;

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/users",
  "/roles",
  "/permissions"
] as const;
