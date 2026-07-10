import { ApiError } from "./api-error";

export class ValidationError extends ApiError {
  readonly status = 422;

  readonly code = "VALIDATION_ERROR";
}
