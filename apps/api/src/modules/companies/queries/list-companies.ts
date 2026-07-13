import { companyRepository } from "../repository";

export async function listCompaniesQuery(tenantId: string) {
  return companyRepository(tenantId).list();
}
