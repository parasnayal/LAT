"use client";

import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "../api/roles.api";
import type { RbacListParams } from "@/shared/types/rbac";

export function useRoles(params: RbacListParams) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => rolesApi.list(params)
  });
}

export function useRoleOptions() {
  return useQuery({
    queryKey: ["roles", "options"],
    queryFn: rolesApi.options,
    staleTime: 1000 * 60 * 15
  });
}
