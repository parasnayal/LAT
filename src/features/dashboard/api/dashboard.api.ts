import { ApiError } from "@/shared/services/http/api-error";
import type { ApiErrorBody } from "@/shared/types/api";
import type { DashboardMetric } from "../types/dashboard.types";

async function parseResponse<TData>(response: Response): Promise<TData> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorBody: ApiErrorBody =
      typeof body === "object" && body !== null
        ? (body as ApiErrorBody)
        : { message: String(body || response.statusText) };

    throw new ApiError(response.status, errorBody);
  }

  return body as TData;
}

async function dashboardFetch<TData>(path: string, options: RequestInit = {}) {
  const response = await fetch(`/api/dashboard${path}`, {
    ...options,
    credentials: "include"
  });

  return parseResponse<TData>(response);
}

export const dashboardApi = {
  getMetrics() {
    return dashboardFetch<DashboardMetric[]>("/metrics");
  }
};
