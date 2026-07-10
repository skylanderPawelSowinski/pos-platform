import { OpenAPIHono } from "@hono/zod-openapi";

import { ValidationError } from "./errors";

export function createRouter() {
  return new OpenAPIHono({
    defaultHook: (result) => {
      if (!result.success) {
        throw new ValidationError(
          "VALIDATION_FAILED",
          result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        );
      }
    },
  });
}
