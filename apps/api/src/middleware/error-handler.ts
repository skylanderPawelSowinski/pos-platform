import type { Context } from "hono";
import { ApiError } from "../core/errors";
import { logger } from "../lib/logger";

export function errorHandler(error: Error, c: Context) {
  if (error instanceof ApiError) {
    return c.json(
      {
        success: false,

        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
        requestId: c.get("requestId"),
      },
      error.status,
    );
  }

  logger.error(
    {
      err: error,
      requestId: c.get("requestId"),
    },
    "Unhandled error",
  );

  return c.json(
    {
      success: false,

      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },

      requestId: c.get("requestId"),
    },
    500,
  );
}
