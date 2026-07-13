import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./_shared";
import { tenants } from "./tenants";

/**
 * Company — podmiot prawny w ramach Tenanta (NIP, dane fakturowe).
 * Poziom raportowania i grupowania oddziałów.
 */
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),

    taxNumber: varchar("tax_number", { length: 32 }),

    email: varchar("email", { length: 255 }),

    phone: varchar("phone", { length: 32 }),

    ...timestamps,
  },
  (table) => [index("companies_tenant_idx").on(table.tenantId)],
);
