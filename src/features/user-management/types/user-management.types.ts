import type { UserRole } from "@/features/auth/types/auth.types";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
};
