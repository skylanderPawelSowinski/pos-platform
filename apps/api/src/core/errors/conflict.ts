import { ApiError } from "./api-error";

export class ConflictError extends ApiError {
  readonly status = 409;

  readonly code = "CONFLICT";
}
