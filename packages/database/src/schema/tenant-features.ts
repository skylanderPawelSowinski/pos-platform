import {
  boolean,
  index,
  pgEnum,
  pgTable,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { timestamps } from "./_shared";
import { tenants } from "./tenants";

export const featureKey = pgEnum("feature_key", [
  "BOOKING",
  "LOYALTY",
  "ONLINE_ORDERS",
  "KDS",
  "API_ACCESS",
  "MULTI_WAREHOUSE",
  "MULTI_BRANCH",
  "GIFT_CARDS",
  "CRM",
  "REPORTS_ADVANCED",
]);

/**
 * TenantFeature — flaga włączenia modułu/funkcji dla Tenanta.
 */
export const tenantFeatures = pgTable(
  "tenant_features",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    feature: featureKey().notNull(),

    enabled: boolean("enabled").notNull().default(false),

    ...timestamps,
  },
  (table) => [
    index("tenant_features_tenant_idx").on(table.tenantId),
    unique("tenant_features_tenant_feature_uq").on(
      table.tenantId,
      table.feature,
    ),
  ],
);
