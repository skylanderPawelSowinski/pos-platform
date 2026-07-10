import { createMiddleware } from "hono/factory";

export const requestId = createMiddleware(
    async (c, next) => {

        const id = crypto.randomUUID();

        c.header(
            "x-request-id",
            id
        );

        await next();
    }
);