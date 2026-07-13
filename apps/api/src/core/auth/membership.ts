import { db, schema } from "@repo/database";
import { and, eq } from "drizzle-orm";

import type { Role } from "./permissions";

/** Zwraca członkostwo (rolę) użytkownika w danym Tenancie lub null. */
export async function findMembership(
  tenantId: string,
  userId: string,
): Promise<{ role: Role } | null> {
  const [membership] = await db
    .select({ role: schema.tenantMembers.role })
    .from(schema.tenantMembers)
    .where(
      and(
        eq(schema.tenantMembers.tenantId, tenantId),
        eq(schema.tenantMembers.userId, userId),
      ),
    );

  return membership ?? null;
}
