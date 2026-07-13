import { Hono } from "hono";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { loggerMiddleware } from "./middleware/logger";
import { requestId } from "./middleware/request-id";
import { tenantContext } from "./middleware/tenant-context";
import { router } from "./router";

export const app = new Hono();

// Middleware
app.use("*", requestId);
app.use("*", auth);
app.use("*", tenantContext);
// Logger
app.use("*", loggerMiddleware);
// Routes
app.route("/", router);
// Error Handler
app.onError(errorHandler);
