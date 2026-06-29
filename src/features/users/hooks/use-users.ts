"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import type { RbacListParams } from "@/shared/types/rbac";

export function useUsers(params: RbacListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.list(params)
  });
}
