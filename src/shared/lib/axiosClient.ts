"use client";

import axios from "axios";
import { readAuthToken } from "@/features/auth/utils/auth-cookies";
import { clientEnv } from "@/shared/config/env";

export const axiosClient = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = readAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const next = encodeURIComponent(window.location.pathname);
      window.location.assign(`/login?next=${next}`);
    }

    return Promise.reject(error);
  }
);
