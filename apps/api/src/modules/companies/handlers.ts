import type { RouteHandler } from "@hono/zod-openapi";

import { requirePermission } from "../../core/auth/guards";
import { PERMISSIONS } from "../../core/auth/permissions";
import { createCompanyCommand } from "./commands/create-company";
import { listCompaniesQuery } from "./queries/list-companies";
import type { createCompanyRoute, listCompaniesRoute } from "./routes";

export const createCompanyHandler: RouteHandler<
  typeof createCompanyRoute
> = async (c) => {
  const { tenantId } = await requirePermission(c, PERMISSIONS.COMPANY_MANAGE);
  const body = c.req.valid("json");

  const company = await createCompanyCommand(tenantId, body);

  return c.json(company, 201);
};

export const listCompaniesHandler: RouteHandler<
  typeof listCompaniesRoute
> = async (c) => {
  const { tenantId } = await requirePermission(c, PERMISSIONS.COMPANY_VIEW);

  const companies = await listCompaniesQuery(tenantId);

  return c.json(companies);
};
