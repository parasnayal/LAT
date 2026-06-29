import { buildRbacQuery } from "@/shared/services/rbac/rbac-query";
import type { RbacListParams, RbacListResponse, RbacUser } from "@/shared/types/rbac";

export const usersApi = {
  async list(params: RbacListParams) {
    const response = await fetch(`/api/rbac/users?${buildRbacQuery(params)}`);

    if (!response.ok) {
      throw new Error("Unable to load users");
    }

    return (await response.json()) as RbacListResponse<RbacUser>;
  }
};
