import { createMiddleware } from "hono/factory";
import { logger } from "../lib/logger";

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  logger.info({
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: Date.now() - start,
    requestId: c.get("requestId"),
  });
});
