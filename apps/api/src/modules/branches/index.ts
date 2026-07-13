import { createRouter } from "../../core/router";
import { createBranchHandler, listBranchesHandler } from "./handlers";
import { createBranchRoute, listBranchesRoute } from "./routes";

export const branchesRouter = createRouter();

branchesRouter.openapi(createBranchRoute, createBranchHandler);

branchesRouter.openapi(listBranchesRoute, listBranchesHandler);
