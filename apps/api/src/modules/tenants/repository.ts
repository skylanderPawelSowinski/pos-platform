import { db, schema } from "@repo/database";
import { eq } from "drizzle-orm";

export const tenantRepository = {
  async findBySlug(slug: string) {
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, slug));

    return tenant ?? null;
  },
};
