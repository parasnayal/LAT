import axios from "axios";
import { clientEnv } from "@/shared/config/env";
import type { ApiErrorBody } from "@/shared/types/api";
import { ApiError } from "./api-error";

export const axiosClient = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError<ApiErrorBody>(error) && error.response) {
      return Promise.reject(new ApiError(error.response.status, error.response.data));
    }

    return Promise.reject(error);
  }
);
