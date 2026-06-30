export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  users: "/users",
  roles: "/roles",
  permissions: "/permissions",
  reports: "/reports",
  forbidden: "/403"
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
