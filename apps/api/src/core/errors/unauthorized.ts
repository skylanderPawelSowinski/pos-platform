import { ApiError } from "./api-error";

export class UnauthorizedError extends ApiError {
  readonly status = 401;

  readonly code = "UNAUTHORIZED";
}
