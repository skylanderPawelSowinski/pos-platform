import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { tenants } from "./tenants";

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    address: varchar("address", {
      length: 500,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (table) => ({
    tenantIdx: index("locations_tenant_idx").on(table.tenantId),
  }),
);
