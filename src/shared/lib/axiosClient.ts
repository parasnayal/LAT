"use client";

import axios from "axios";
import { clientEnv } from "@/shared/config/env";

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? null
  );
}

export const axiosClient = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? (window.localStorage.getItem("accessToken") ?? readCookie("accessToken"))
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
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
