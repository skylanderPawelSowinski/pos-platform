import { ApiError } from "./api-error";

export class ForbiddenError extends ApiError {
    readonly status = 403;

    readonly code = "FORBIDDEN";
}