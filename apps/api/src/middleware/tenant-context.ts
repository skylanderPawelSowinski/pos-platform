import { createMiddleware } from "hono/factory";

export const tenantContext = createMiddleware(async (c, next) => {
  const tenantId = c.req.header("x-tenant-id");

  c.set("tenantContext", {
    requestId: c.get("requestId"),

    tenantId: tenantId ?? null,

    branchId: null,

    registerId: null,

    userId: c.get("userId") ?? null,

    permissions: [],
  });

  await next();
});
