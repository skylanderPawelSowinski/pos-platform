import type { RouteHandler } from "@hono/zod-openapi";

import { requireUserId } from "../../core/auth/guards";
import { createTenantCommand } from "./commands/create-tenant";
import { listTenantsQuery } from "./queries/list-tenants";
import type { createTenantRoute, listTenantsRoute } from "./routes";

export const createTenantHandler: RouteHandler<
  typeof createTenantRoute
> = async (c) => {
  const userId = requireUserId(c);
  const body = c.req.valid("json");

  const tenant = await createTenantCommand(userId, body);

  return c.json(tenant, 201);
};

export const listTenantsHandler: RouteHandler<typeof listTenantsRoute> = async (
  c,
) => {
  const userId = requireUserId(c);

  const tenants = await listTenantsQuery(userId);
  return c.json(tenants);
};
