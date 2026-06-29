import { buildRbacQuery } from "@/shared/services/rbac/rbac-query";
import type { Permission, RbacListParams, RbacListResponse } from "@/shared/types/rbac";

export const permissionsApi = {
  async list(params: RbacListParams) {
    const response = await fetch(`/api/rbac/permissions?${buildRbacQuery(params)}`);

    if (!response.ok) {
      throw new Error("Unable to load permissions");
    }

    return (await response.json()) as RbacListResponse<Permission>;
  }
};
