import { Hono } from "hono";

import { router } from "./router";

import { errorHandler } from "./middleware/error-handler";
import { requestId } from "./middleware/request-id";
import { loggerMiddleware } from "./middleware/logger";
import { tenantContext } from "./middleware/tenant-context";


export const app = new Hono();

// Middleware
app.use("*", requestId);
app.use("*", tenantContext);
// Logger
app.use("*", loggerMiddleware);
// Routes
app.route("/", router);
// Error Handler
app.onError(errorHandler);