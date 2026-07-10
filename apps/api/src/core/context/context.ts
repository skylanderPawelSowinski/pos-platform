import type { Context } from "hono";
import type { TenantContext } from "./types";

declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
    tenantContext: TenantContext;
  }
}

export type AppContext = Context & {
  var: {
    requestId: string;
    tenantContext: TenantContext;
  };
};
