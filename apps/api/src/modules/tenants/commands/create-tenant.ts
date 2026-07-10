import type { CreateTenant } from "@repo/contracts";
import { ConflictError } from "../../../core/errors";
import { tenantRepository } from "../repository";

export async function createTenantCommand(input: CreateTenant) {
  const existing = await tenantRepository.findBySlug(input.slug);

  if (existing) {
    throw new ConflictError("TENANT_ALREADY_EXISTS");
  }

  return tenantRepository.create(input);
}
