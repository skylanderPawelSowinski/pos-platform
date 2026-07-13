import { timestamp } from "drizzle-orm/pg-core";

/**
 * Wspólne kolumny czasu dla wszystkich tabel.
 * `updatedAt` aktualizuje się automatycznie przy każdym db.update(...).
 */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};
