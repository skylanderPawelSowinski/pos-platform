import { env } from "@repo/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const client = postgres(env.DATABASE_URL, {
  // Nie zaśmiecaj logów NOTICE-ami (np. TRUNCATE ... CASCADE).
  onnotice: () => {},
});

export const db = drizzle(client, {
  schema,
});

/** Zamyka pulę połączeń (graceful shutdown / cleanup w testach). */
export function closeDb() {
  return client.end();
}
