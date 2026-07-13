export type TenantContext = {
  requestId: string;

  tenantId: string | null;

  branchId: string | null;

  registerId: string | null;

  userId: string | null;

  permissions: string[];
};
