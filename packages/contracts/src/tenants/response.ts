import { z } from "zod";

export const TenantStatusSchema = z.enum(["trial", "active", "suspended"]);

export type TenantStatus = z.infer<typeof TenantStatusSchema>;

export const TenantResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  status: TenantStatusSchema,
});

export type TenantResponse = z.infer<typeof TenantResponseSchema>;

export const TenantListResponseSchema = z.array(TenantResponseSchema);

export type TenantListResponse = z.infer<typeof TenantListResponseSchema>;
