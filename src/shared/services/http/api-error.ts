import type { ApiErrorBody } from "@/shared/types/api";

export class ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
  }
}
