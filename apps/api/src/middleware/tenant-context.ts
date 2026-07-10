import { createMiddleware } from "hono/factory";

export const tenantContext = createMiddleware(
    async (c, next) => {
        const tenantId = c.req.header("x-tenant-id");

        c.set(
            "tenantContext",
            {
                requestId: c.req.header("x-request-id"),

                tenantId: tenantId ?? null,

                locationId: null,

                registerId: null,

                userId: null,

                permissions: [],
            }
        )

        await next();
    }
) 