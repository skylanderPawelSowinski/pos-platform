import type {
    CreateTenant,
} from "@repo/contracts";

import { tenantRepository } from "../repository";
import { ConflictError } from "apps/api/src/core/errors";

export async function createTenantCommand(
    input: CreateTenant,
) {
    const existing =
        await tenantRepository.findBySlug(
            input.slug,
        );

    if (existing) {
        throw new ConflictError("TENANT_ALREADY_EXISTS");
    }

    return tenantRepository.create(
        input,
    );
}