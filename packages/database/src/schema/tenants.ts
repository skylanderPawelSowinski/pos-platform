import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./_shared";

export const tenantStatus = pgEnum("tenant_status", [
  "trial",
  "active",
  "suspended",
]);

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  slug: varchar("slug", { length: 100 }).notNull().unique(),

  status: tenantStatus().notNull().default("trial"),

  ...timestamps,
});
