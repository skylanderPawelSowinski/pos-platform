import type { CreateBranch } from "@repo/contracts";

import { NotFoundError } from "../../../core/errors";
import { companyRepository } from "../../companies/repository";
import { branchRepository } from "../repository";

export async function createBranchCommand(
  tenantId: string,
  input: CreateBranch,
) {
  // Company musi należeć do tego samego Tenanta — inaczej branch mógłby
  // zostać podpięty pod cudzą firmę.
  const company = await companyRepository(tenantId).findById(input.companyId);

  if (!company) {
    throw new NotFoundError("COMPANY_NOT_FOUND");
  }

  return branchRepository(tenantId).create(input);
}
