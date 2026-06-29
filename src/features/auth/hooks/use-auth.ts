"use client";

import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(user),
    signOut: clearSession
  };
}
