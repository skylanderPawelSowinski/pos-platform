import { z } from "zod";

export const CreateTenantSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(255),

    slug: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
});

export type CreateTenant =
    z.infer<typeof CreateTenantSchema>;