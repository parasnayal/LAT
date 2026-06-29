import { fetchClient } from "@/shared/services/http/fetch-client";
import type { Profile } from "../types/profile.types";

export const profileApi = {
  getProfile() {
    return fetchClient<Profile>("/profile");
  },
  updateProfile(payload: Partial<Profile>) {
    return fetchClient<Profile>("/profile", {
      method: "PATCH",
      body: payload
    });
  }
};
