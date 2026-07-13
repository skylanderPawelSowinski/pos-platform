import type { CreateTenant } from "@repo/contracts";
import { db, schema } from "@repo/database";

import { ConflictError } from "../../../core/errors";
import { tenantRepository } from "../repository";

/**
 * Tworzy Tenanta i w tej samej transakcji nadaje twórcy członkostwo `owner`.
 */
export async function createTenantCommand(userId: string, input: CreateTenant) {
  const existing = await tenantRepository.findBySlug(input.slug);

  if (existing) {
    throw new ConflictError("TENANT_ALREADY_EXISTS");
  }

  return db.transaction(async (tx) => {
    const [tenant] = await tx.insert(schema.tenants).values(input).returning({
      id: schema.tenants.id,
      name: schema.tenants.name,
      slug: schema.tenants.slug,
      status: schema.tenants.status,
    });

    if (!tenant) {
      throw new Error("Tenant insert returned no row");
    }

    await tx.insert(schema.tenantMembers).values({
      tenantId: tenant.id,
      userId,
      role: "owner",
      joinedAt: new Date(),
    });

    return tenant;
  });
}
