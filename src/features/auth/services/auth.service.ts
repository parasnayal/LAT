import { authApi } from "../api/auth.api";
import type { LoginRequest } from "../types/auth.types";

export const authService = {
  async login(payload: LoginRequest) {
    return authApi.login(payload);
  },
  async logout() {
    await authApi.logout();
  }
};
