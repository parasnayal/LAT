import axios from "axios";
import { readAuthToken } from "@/features/auth/utils/auth-cookies";

export const latApiClient = axios.create({
  baseURL: "/api/lat",
  headers: {
    "Content-Type": "application/json"
  }
});

latApiClient.interceptors.request.use((config) => {
  const token = readAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
