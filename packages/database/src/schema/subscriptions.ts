import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "./_shared";
import { tenants } from "./tenants";

export const subscriptionPlan = pgEnum("subscription_plan", [
  "starter",
  "standard",
  "professional",
  "enterprise",
]);

export const subscriptionStatus = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "expired",
]);

/**
 * Subscription — subskrypcja Tenanta (jedna aktywna na Tenanta).
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  tenantId: uuid("tenant_id")
    .notNull()
    .unique()
    .references(() => tenants.id, { onDelete: "cascade" }),

  plan: subscriptionPlan().notNull().default("starter"),

  status: subscriptionStatus().notNull().default("trialing"),

  startsAt: timestamp("starts_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  expiresAt: timestamp("expires_at", { withTimezone: true }),

  trialUntil: timestamp("trial_until", { withTimezone: true }),

  ...timestamps,
});
