import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().trim().min(2).max(255),

  taxNumber: z.string().trim().max(32).optional(),

  email: z.email().max(255).optional(),

  phone: z.string().trim().max(32).optional(),
});

export type CreateCompany = z.infer<typeof CreateCompanySchema>;
