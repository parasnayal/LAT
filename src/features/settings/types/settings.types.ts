export type NotificationPreference = "all" | "important" | "none";

export type UserSettings = {
  notifications: NotificationPreference;
  darkMode: boolean;
};
