"use client";

import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "../api/permissions.api";
import type { RbacListParams } from "@/shared/types/rbac";

export function usePermissions(params: RbacListParams) {
  return useQuery({
    queryKey: ["permissions", params],
    queryFn: () => permissionsApi.list(params)
  });
}
