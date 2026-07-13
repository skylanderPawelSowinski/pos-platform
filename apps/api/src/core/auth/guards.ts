import type { Context } from "hono";

import { BadRequestError, ForbiddenError, UnauthorizedError } from "../errors";
import { findMembership } from "./membership";
import { type Permission, permissionsForRole, type Role } from "./permissions";

export type Membership = {
  tenantId: string;
  userId: string;
  role: Role;
  permissions: Permission[];
};

/** Wymaga uwierzytelnionego użytkownika (ustawionego przez auth middleware). */
export function requireUserId(c: Context): string {
  const userId = c.get("userId");

  if (!userId) {
    throw new UnauthorizedError("AUTH_REQUIRED");
  }

  return userId;
}

/**
 * Wymaga, by uwierzytelniony użytkownik był członkiem wybranego Tenanta
 * (x-tenant-id). Zwraca rolę i wyprowadzone uprawnienia.
 */
export async function requireMembership(c: Context): Promise<Membership> {
  const userId = requireUserId(c);
  const tenantId = c.get("tenantContext").tenantId;

  if (!tenantId) {
    throw new BadRequestError("TENANT_REQUIRED");
  }

  const membership = await findMembership(tenantId, userId);

  if (!membership) {
    throw new ForbiddenError("NOT_A_MEMBER");
  }

  return {
    tenantId,
    userId,
    role: membership.role,
    permissions: permissionsForRole(membership.role),
  };
}

/** Jak requireMembership, ale dodatkowo egzekwuje konkretne uprawnienie. */
export async function requirePermission(
  c: Context,
  permission: Permission,
): Promise<Membership> {
  const membership = await requireMembership(c);

  if (!membership.permissions.includes(permission)) {
    throw new ForbiddenError("FORBIDDEN");
  }

  return membership;
}
