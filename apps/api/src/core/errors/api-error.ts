import type { ContentfulStatusCode } from "hono/utils/http-status";

export abstract class ApiError extends Error {
  abstract readonly status: ContentfulStatusCode;
  abstract readonly code: string;

  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);

    this.name = this.constructor.name;
    this.details = details;
  }
}
