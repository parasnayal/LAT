import { fetchClient } from "@/shared/services/http/fetch-client";
import type { UserSettings } from "../types/settings.types";

export const settingsApi = {
  getSettings() {
    return fetchClient<UserSettings>("/settings");
  },
  updateSettings(payload: Partial<UserSettings>) {
    return fetchClient<UserSettings>("/settings", {
      method: "PATCH",
      body: payload
    });
  }
};
