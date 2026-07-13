import { db, schema } from "@repo/database";
import { eq } from "drizzle-orm";

/** Zwraca Tenantów, w których dany użytkownik jest członkiem. */
export async function listTenantsQuery(userId: string) {
  return db
    .select({
      id: schema.tenants.id,
      name: schema.tenants.name,
      slug: schema.tenants.slug,
      status: schema.tenants.status,
    })
    .from(schema.tenants)
    .innerJoin(
      schema.tenantMembers,
      eq(schema.tenantMembers.tenantId, schema.tenants.id),
    )
    .where(eq(schema.tenantMembers.userId, userId));
}
