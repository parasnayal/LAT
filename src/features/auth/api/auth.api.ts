import axios from "axios";
import type { LatLoginApiResponse, LoginRequest, LoginResponse } from "../types/auth.types";
import { mapRoleIdToRoleCode, mapRoleIdToUserRole } from "../utils/role-routing";

function mapLoginResponse(data: LatLoginApiResponse): LoginResponse {
  if (data.status !== 1 || !data.response?.token) {
    throw new Error(data.message || "Invalid username or password");
  }

  const roleId = data.response.roleId;
  const userName = data.response.userName ?? data.response.fullName ?? "LAT User";

  return {
    accessToken: data.response.token,
    roleCode: mapRoleIdToRoleCode(roleId),
    user: {
      id: String(data.response.userId ?? ""),
      name: userName,
      email: userName.includes("@")
        ? userName
        : `${userName.toLowerCase().replace(/\s+/g, ".")}@lat.local`,
      role: mapRoleIdToUserRole(roleId),
      roleId,
      fullName: data.response.fullName ?? userName
    }
  };
}

export const authApi = {
  async login(payload: LoginRequest) {
    const response = await axios.post<LatLoginApiResponse>("/api/lat/login", {
      userName: payload.userName ?? payload.email ?? "",
      password: payload.password
    });

    return mapLoginResponse(response.data);
  },
  async logout() {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("permissions");
  },
  async me() {
    return null;
  }
};
