import { createRouter } from "../../core/router";
import { createTenantHandler, listTenantsHandler } from "./handlers";
import { createTenantRoute, listTenantsRoute } from "./routes";

export const tenantsRouter = createRouter();

tenantsRouter.openapi(createTenantRoute, createTenantHandler);

tenantsRouter.openapi(listTenantsRoute, listTenantsHandler);
