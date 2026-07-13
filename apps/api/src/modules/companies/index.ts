import { createRouter } from "../../core/router";
import { createCompanyHandler, listCompaniesHandler } from "./handlers";
import { createCompanyRoute, listCompaniesRoute } from "./routes";

export const companiesRouter = createRouter();

companiesRouter.openapi(createCompanyRoute, createCompanyHandler);

companiesRouter.openapi(listCompaniesRoute, listCompaniesHandler);
