import type { Context } from "hono";
import { TenantContext } from "./types";

export type AppContext = Context & {
    var: {
        tenantContext: TenantContext;
    };
};