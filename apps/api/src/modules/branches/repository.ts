import type { CreateBranch } from "@repo/contracts";
import { db, schema } from "@repo/database";
import { and, eq } from "drizzle-orm";

const columns = {
  id: schema.branches.id,
  tenantId: schema.branches.tenantId,
  companyId: schema.branches.companyId,
  name: schema.branches.name,
  address: schema.branches.address,
  timezone: schema.branches.timezone,
};

/**
 * Repozytorium scoped do jednego Tenanta (patrz companies/repository).
 */
export function branchRepository(tenantId: string) {
  return {
    async create(data: CreateBranch) {
      const [branch] = await db
        .insert(schema.branches)
        .values({ ...data, tenantId })
        .returning(columns);

      return branch;
    },

    async list() {
      return db
        .select(columns)
        .from(schema.branches)
        .where(eq(schema.branches.tenantId, tenantId));
    },

    async findById(id: string) {
      const [branch] = await db
        .select(columns)
        .from(schema.branches)
        .where(
          and(
            eq(schema.branches.tenantId, tenantId),
            eq(schema.branches.id, id),
          ),
        );

      return branch ?? null;
    },
  };
}
