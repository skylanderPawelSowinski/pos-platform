import type { Context } from "hono";
import { ApiError } from "../core/errors";

export function errorHandler(
    error: Error,
    c: Context,
) {
    if (error instanceof ApiError) {
        return c.json(
            {
                success: false,

                error: {
                    code: error.code,
                    message: error.message,
                },
                requestId: c.get("requestId"),
            },
            error.status,
        );
    }

    console.error(error);

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