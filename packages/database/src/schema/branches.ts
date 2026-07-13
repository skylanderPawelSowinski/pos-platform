import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./_shared";
import { companies } from "./companies";
import { tenants } from "./tenants";

/**
 * Branch — fizyczny oddział/lokal należący do Company.
 * Nosi zarówno tenant_id (izolacja) jak i company_id (grupowanie/raporty).
 */
export const branches = pgTable(
  "branches",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),

    address: varchar("address", { length: 500 }),

    timezone: varchar("timezone", { length: 64 })
      .notNull()
      .default("Europe/Warsaw"),

    ...timestamps,
  },
  (table) => [
    index("branches_tenant_idx").on(table.tenantId),
    index("branches_company_idx").on(table.companyId),
  ],
);
