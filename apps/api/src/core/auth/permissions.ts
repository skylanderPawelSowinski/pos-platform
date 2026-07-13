import type { schema } from "@repo/database";

export const PERMISSIONS = {
  COMPANY_VIEW: "COMPANY_VIEW",
  COMPANY_MANAGE: "COMPANY_MANAGE",
  BRANCH_VIEW: "BRANCH_VIEW",
  BRANCH_MANAGE: "BRANCH_MANAGE",
  MEMBER_MANAGE: "MEMBER_MANAGE",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Rola pochodzi z enuma DB — brak dryfu między bazą a kodem. */
export type Role = (typeof schema.memberRole.enumValues)[number];

const ALL: Permission[] = Object.values(PERMISSIONS);

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL,
  administrator: ALL,
  manager: [
    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.BRANCH_VIEW,
    PERMISSIONS.BRANCH_MANAGE,
  ],
  cashier: [PERMISSIONS.COMPANY_VIEW, PERMISSIONS.BRANCH_VIEW],
  employee: [PERMISSIONS.COMPANY_VIEW, PERMISSIONS.BRANCH_VIEW],
};

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}
