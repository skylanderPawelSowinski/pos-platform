import { ApiError } from "./api-error";

export class BadRequestError extends ApiError {
    readonly status = 400;

    readonly code = "BAD_REQUEST";
}