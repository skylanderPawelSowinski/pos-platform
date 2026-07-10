export type TenantContext = {
    requestId: string;

    tenantId: string | null;

    locationId: string | null;

    registerId: string | null;

    userId: string | null;

    permissions: string[];
};