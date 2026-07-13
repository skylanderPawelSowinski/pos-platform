import type { RouteHandler } from "@hono/zod-openapi";

import { requirePermission } from "../../core/auth/guards";
import { PERMISSIONS } from "../../core/auth/permissions";
import { createBranchCommand } from "./commands/create-branch";
import { listBranchesQuery } from "./queries/list-branches";
import type { createBranchRoute, listBranchesRoute } from "./routes";

export const createBranchHandler: RouteHandler<
  typeof createBranchRoute
> = async (c) => {
  const { tenantId } = await requirePermission(c, PERMISSIONS.BRANCH_MANAGE);
  const body = c.req.valid("json");

  const branch = await createBranchCommand(tenantId, body);

  return c.json(branch, 201);
};

export const listBranchesHandler: RouteHandler<
  typeof listBranchesRoute
> = async (c) => {
  const { tenantId } = await requirePermission(c, PERMISSIONS.BRANCH_VIEW);

  const branches = await listBranchesQuery(tenantId);

  return c.json(branches);
};
