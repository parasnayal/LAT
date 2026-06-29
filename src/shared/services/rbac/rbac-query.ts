import type { RbacListParams } from "@/shared/types/rbac";

export function buildRbacQuery(params: RbacListParams) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });

  return query.toString();
}
