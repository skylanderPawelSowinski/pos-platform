import { z } from "zod";

export const CompanyResponseSchema = z.object({
  id: z.uuid(),
  tenantId: z.uuid(),
  name: z.string(),
  taxNumber: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
});

export type CompanyResponse = z.infer<typeof CompanyResponseSchema>;

export const CompanyListResponseSchema = z.array(CompanyResponseSchema);

export type CompanyListResponse = z.infer<typeof CompanyListResponseSchema>;
