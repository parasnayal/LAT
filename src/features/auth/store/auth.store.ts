"use client";

import type { AuthUser } from "../types/auth.types";
import { createAppStore } from "@/shared/store/create-store";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = createAppStore<AuthState>("auth-store", (set) => ({
  user: null,
  accessToken: null,
  setSession: (user, accessToken) => set({ user, accessToken }),
  clearSession: () => set({ user: null, accessToken: null })
}));
