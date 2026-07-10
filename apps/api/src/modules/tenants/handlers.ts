import type { RouteHandler } from "@hono/zod-openapi";

import { createTenantCommand } from "./commands/create-tenant";
import { listTenantsQuery } from "./queries/list-tenants";
import type { createTenantRoute, listTenantsRoute } from "./routes";

export const createTenantHandler: RouteHandler<
  typeof createTenantRoute
> = async (c) => {
  const body = c.req.valid("json");

  const tenant = await createTenantCommand(body);

  return c.json(tenant, 201);
};

export const listTenantsHandler: RouteHandler<typeof listTenantsRoute> = async (
  c,
) => {
  const tenants = await listTenantsQuery();
  return c.json(tenants);
};
