import { eq } from "drizzle-orm";

import { db, schema } from "@repo/database";

import type {
    CreateTenant,
} from "@repo/contracts";

export const tenantRepository = {

    async create(
        data: CreateTenant,
    ) {

        const [tenant] =
            await db
                .insert(schema.tenants)
                .values(data)
                .returning({
                    id: schema.tenants.id,
                    name: schema.tenants.name,
                    slug: schema.tenants.slug,
                    status: schema.tenants.status,
                });

        return tenant;
    },

    async findById(
        id: string,
    ) {

        const [tenant] =
            await db
                .select()
                .from(schema.tenants)
                .where(
                    eq(schema.tenants.id, id),
                );

        return tenant ?? null;
    },

    async findBySlug(
        slug: string,
    ) {

        const [tenant] =
            await db
                .select()
                .from(schema.tenants)
                .where(
                    eq(schema.tenants.slug, slug),
                );

        return tenant ?? null;
    },

    async list() {

        return db
            .select()
            .from(schema.tenants);
    },

};