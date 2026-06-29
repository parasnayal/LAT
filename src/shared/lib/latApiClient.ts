import axios from "axios";

function readToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("accessToken");
}

export const latApiClient = axios.create({
  baseURL: "/api/lat",
  headers: {
    "Content-Type": "application/json"
  }
});

latApiClient.interceptors.request.use((config) => {
  const token = readToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
