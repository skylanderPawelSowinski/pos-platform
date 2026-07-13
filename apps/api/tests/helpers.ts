import { db, schema } from "@repo/database";
import { sql } from "drizzle-orm";
import { sign } from "hono/jwt";

import { app } from "../src/app";

const SECRET = "test-secret";

type Role = (typeof schema.memberRole.enumValues)[number];

export async function reset() {
  // FK cascade czyści companies/branches/subscriptions/members/features.
  await db.execute(sql`TRUNCATE tenants CASCADE`);
}

export function signToken(sub: string) {
  return sign({ sub }, SECRET);
}

type Opts = { token?: string; tenantId?: string };

function headers(opts: Opts, base: Record<string, string> = {}) {
  if (opts.token) base.authorization = `Bearer ${opts.token}`;
  if (opts.tenantId) base["x-tenant-id"] = opts.tenantId;
  return base;
}

export function post(path: string, body: unknown, opts: Opts = {}) {
  return app.request(path, {
    method: "POST",
    headers: headers(opts, { "content-type": "application/json" }),
    body: JSON.stringify(body),
  });
}

export function get(path: string, opts: Opts = {}) {
  return app.request(path, { headers: headers(opts) });
}

/** Nowy użytkownik = losowy sub + podpisany token. */
export async function newUser(): Promise<{ id: string; token: string }> {
  const id = crypto.randomUUID();
  return { id, token: await signToken(id) };
}

/** Tworzy Tenanta jako dany użytkownik (staje się ownerem). */
export async function createTenant(
  token: string,
  slug: string,
): Promise<{ id: string }> {
  const res = await post(
    "/api/v1/tenants/create",
    { name: `T ${slug}`, slug },
    { token },
  );
  return res.json();
}

/** Wstawia członkostwo bezpośrednio (symulacja zaproszenia). */
export async function addMember(tenantId: string, userId: string, role: Role) {
  await db.insert(schema.tenantMembers).values({
    tenantId,
    userId,
    role,
    joinedAt: new Date(),
  });
}
