import { fetchClient } from "@/shared/services/http/fetch-client";
import type { PaginatedResponse } from "@/shared/types/api";
import type { ManagedUser } from "../types/user-management.types";

export const userManagementApi = {
  listUsers(params: { page: number; pageSize: number }) {
    const query = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize)
    });

    return fetchClient<PaginatedResponse<ManagedUser>>(`/users?${query.toString()}`);
  },
  updateUser(userId: string, payload: Partial<ManagedUser>) {
    return fetchClient<ManagedUser>(`/users/${userId}`, {
      method: "PATCH",
      body: payload
    });
  }
};
