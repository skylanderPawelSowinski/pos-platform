import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../../core/router";

const healthSchema = z.object({
  status: z.string(),
});

const route = createRoute({
  method: "get",
  path: "/",
  tags: ["Health"],
  responses: {
    200: {
      description: "Health check",
      content: {
        "application/json": {
          schema: healthSchema,
        },
      },
    },
  },
});

export const healthRoutes = createRouter();

healthRoutes.openapi(route, (c) => {
  return c.json({
    status: "ok",
  });
});
