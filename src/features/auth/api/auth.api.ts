import axios from "axios";
import type { LatLoginApiResponse, LoginRequest, LoginResponse } from "../types/auth.types";
import { mapRoleIdToRoleCode, mapRoleIdToUserRole } from "../utils/role-routing";

const LAT_LOGIN_URL = "https://faq-admin.projectinclusion.in/api/LAT/login";

function parseLoginResponse(data: LatLoginApiResponse | string): LatLoginApiResponse {
  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data) as LatLoginApiResponse;
  } catch {
    return {
      status: 0,
      message: data
    };
  }
}

function mapLoginResponse(data: LatLoginApiResponse): LoginResponse {
  if (data.status !== 1 || !data.response?.token) {
    throw new Error(data.message || "Invalid username or password");
  }

  const roleId = data.response.roleId;
  const userName = data.response.userName ?? data.response.fullName ?? "LAT User";

  return {
    accessToken: data.response.token,
    latUser: data.response,
    roleCode: mapRoleIdToRoleCode(roleId),
    user: {
      id: String(data.response.id ?? data.response.userId ?? ""),
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
    const response = await axios.post<LatLoginApiResponse | string>(
      LAT_LOGIN_URL,
      {
        userName: payload.userName ?? payload.email ?? "",
        password: payload.password
      },
      {
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json"
        }
      }
    );

    return mapLoginResponse(parseLoginResponse(response.data));
  },
  async logout() {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("permissions");
    window.localStorage.removeItem("userDetail");
  },
  async me() {
    return null;
  }
};
