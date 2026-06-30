import { clientEnv } from "@/shared/config/env";
import { readAuthToken } from "@/features/auth/utils/auth-cookies";
import type { ApiErrorBody } from "@/shared/types/api";
import { ApiError } from "./api-error";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
};

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

export async function fetchClient<TData>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const hasJsonBody = options.body && !(options.body instanceof FormData);
  const body: BodyInit | undefined = hasJsonBody
    ? JSON.stringify(options.body)
    : (options.body as BodyInit | undefined);
  const token = readAuthToken();

  if (hasJsonBody) {
    headers.set("content-type", "application/json");
  }

  if (token && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
    credentials: "include"
  });

  return parseResponse<TData>(response);
}
