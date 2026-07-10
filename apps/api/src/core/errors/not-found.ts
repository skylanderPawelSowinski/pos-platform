import { ApiError } from "./api-error";

export class NotFoundError extends ApiError {
  readonly status = 404;

  readonly code = "NOT_FOUND";
}
