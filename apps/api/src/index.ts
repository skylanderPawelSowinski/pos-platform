import { serve } from "bun";
import { app } from "./app";
import { env } from "./config/env";


serve({
  fetch: app.fetch,
  port: env.PORT,
});


console.log(
  `🚀 API running on http://localhost:${env.PORT}`
);