import { OpenAPIHono } from "@hono/zod-openapi";

import {
    createTenantRoute,
    listTenantsRoute,
} from "./routes";

import {
    createTenantHandler,
    listTenantsHandler,
} from "./handlers";

export const tenantsRouter =
    new OpenAPIHono();

tenantsRouter.openapi(
    createTenantRoute,
    createTenantHandler,
);

tenantsRouter.openapi(
    listTenantsRoute,
    listTenantsHandler,
);