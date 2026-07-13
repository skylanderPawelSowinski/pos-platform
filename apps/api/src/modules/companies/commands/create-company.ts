import type { CreateCompany } from "@repo/contracts";

import { companyRepository } from "../repository";

export async function createCompanyCommand(
  tenantId: string,
  input: CreateCompany,
) {
  return companyRepository(tenantId).create(input);
}
