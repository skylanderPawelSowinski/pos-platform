import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { timestamps } from "./_shared";
import { tenants } from "./tenants";

export const memberRole = pgEnum("member_role", [
  "owner",
  "administrator",
  "manager",
  "cashier",
  "employee",
]);

/**
 * TenantMember — powiązanie użytkownika (tożsamości) z Tenantem + rola.
 * user_id wskazuje na tożsamość z providera auth (np. Cognito sub) — bez FK,
 * bo tabela users pojawi się przy wdrożeniu logowania.
 */
export const tenantMembers = pgTable(
  "tenant_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    userId: uuid("user_id").notNull(),

    role: memberRole().notNull().default("employee"),

    invitedBy: uuid("invited_by"),

    joinedAt: timestamp("joined_at", { withTimezone: true }),

    ...timestamps,
  },
  (table) => [
    index("tenant_members_tenant_idx").on(table.tenantId),
    unique("tenant_members_tenant_user_uq").on(table.tenantId, table.userId),
  ],
);
