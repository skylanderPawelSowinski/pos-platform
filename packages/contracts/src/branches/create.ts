import { z } from "zod";

export const CreateBranchSchema = z.object({
  companyId: z.uuid(),

  name: z.string().trim().min(2).max(255),

  address: z.string().trim().max(500).optional(),

  timezone: z.string().trim().max(64).optional(),
});

export type CreateBranch = z.infer<typeof CreateBranchSchema>;
