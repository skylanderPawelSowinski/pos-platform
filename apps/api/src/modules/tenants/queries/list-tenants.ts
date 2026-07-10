import { tenantRepository } from "../repository";

export async function listTenantsQuery() {
    return await tenantRepository.list();
}