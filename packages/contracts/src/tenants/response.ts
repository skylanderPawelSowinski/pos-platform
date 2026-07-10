import { z } from "zod";

export const TenantResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),
});

export type TenantResponse =
    z.infer<typeof TenantResponseSchema>;