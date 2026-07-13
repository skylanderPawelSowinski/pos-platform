import { z } from "zod";

export const BranchResponseSchema = z.object({
  id: z.uuid(),
  tenantId: z.uuid(),
  companyId: z.uuid(),
  name: z.string(),
  address: z.string().nullable(),
  timezone: z.string(),
});

export type BranchResponse = z.infer<typeof BranchResponseSchema>;

export const BranchListResponseSchema = z.array(BranchResponseSchema);

export type BranchListResponse = z.infer<typeof BranchListResponseSchema>;
