import { branchRepository } from "../repository";

export async function listBranchesQuery(tenantId: string) {
  return branchRepository(tenantId).list();
}
