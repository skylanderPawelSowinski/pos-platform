import type { CreateCompany } from "@repo/contracts";
import { db, schema } from "@repo/database";
import { and, eq } from "drizzle-orm";

const columns = {
  id: schema.companies.id,
  tenantId: schema.companies.tenantId,
  name: schema.companies.name,
  taxNumber: schema.companies.taxNumber,
  email: schema.companies.email,
  phone: schema.companies.phone,
};

/**
 * Repozytorium scoped do jednego Tenanta — każde zapytanie ma wymuszony
 * filtr tenant_id, więc nie da się odpytać danych innego Tenanta (warstwa 1
 * izolacji; RLS dołoży warstwę 2 w bazie).
 */
export function companyRepository(tenantId: string) {
  return {
    async create(data: CreateCompany) {
      const [company] = await db
        .insert(schema.companies)
        .values({ ...data, tenantId })
        .returning(columns);

      return company;
    },

    async list() {
      return db
        .select(columns)
        .from(schema.companies)
        .where(eq(schema.companies.tenantId, tenantId));
    },

    async findById(id: string) {
      const [company] = await db
        .select(columns)
        .from(schema.companies)
        .where(
          and(
            eq(schema.companies.tenantId, tenantId),
            eq(schema.companies.id, id),
          ),
        );

      return company ?? null;
    },
  };
}
