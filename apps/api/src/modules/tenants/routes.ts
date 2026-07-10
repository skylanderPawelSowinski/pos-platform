import { createRoute, z } from "@hono/zod-openapi";

import {
    CreateTenantSchema,
    TenantResponseSchema,
} from "@repo/contracts";

export const createTenantRoute = createRoute({
    method: "post",

    path: "/create",

    tags: ["Tenants"],

    summary: "Create tenant",

    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateTenantSchema,
                },
            },
        },
    },

    responses: {
        201: {
            description: "Tenant created",

            content: {
                "application/json": {
                    schema: TenantResponseSchema,
                },
            },
        },
    },
});

export const listTenantsRoute = createRoute({
    method: "get",

    path: "/list",

    tags: ["Tenants"],

    summary: "List tenants",

    responses: {
        200: {
            description: "Tenants listed",
        },
    },
});