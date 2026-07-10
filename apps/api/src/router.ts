import { swaggerUI } from "@hono/swagger-ui";
import { createRouter } from "./core/router";
import { healthRoutes } from "./modules/health/route";
import { tenantsRouter } from "./modules/tenants";

export const router = createRouter();

router.route("/health", healthRoutes);

router.route("api/v1/tenants", tenantsRouter);

router.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "POS Platform API",
    version: "0.1.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
});

router.get(
  "/docs",
  swaggerUI({
    url: "/openapi.json",
  }),
);
