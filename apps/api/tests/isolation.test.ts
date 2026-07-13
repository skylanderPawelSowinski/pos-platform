import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { closeDb } from "@repo/database";

import { addMember, createTenant, get, newUser, post, reset } from "./helpers";

beforeEach(reset);
afterAll(() => closeDb());

async function createCompany(token: string, tenantId: string) {
  const res = await post(
    "/api/v1/companies/create",
    { name: "Acme" },
    { token, tenantId },
  );
  return res;
}

describe("tenants + auth", () => {
  test("create bez tokenu -> 401 AUTH_REQUIRED", async () => {
    const res = await post("/api/v1/tenants/create", {
      name: "Acme",
      slug: "acme",
    });
    expect(res.status).toBe(401);
    expect((await res.json()).error.message).toBe("AUTH_REQUIRED");
  });

  test("niepoprawny token -> 401 INVALID_TOKEN", async () => {
    const res = await post(
      "/api/v1/tenants/create",
      { name: "Acme", slug: "acme" },
      { token: "garbage.token.here" },
    );
    expect(res.status).toBe(401);
    expect((await res.json()).error.message).toBe("INVALID_TOKEN");
  });

  test("create -> 201; twórca staje się ownerem (widzi tenant na liście)", async () => {
    const user = await newUser();

    const created = await post(
      "/api/v1/tenants/create",
      { name: "Acme", slug: "acme" },
      { token: user.token },
    );
    expect(created.status).toBe(201);
    expect((await created.json()).status).toBe("trial");

    const list = await (
      await get("/api/v1/tenants/list", { token: user.token })
    ).json();
    expect(list).toHaveLength(1);
    expect(list[0].slug).toBe("acme");
  });

  test("lista tenantów pokazuje tylko własne", async () => {
    const a = await newUser();
    const b = await newUser();
    await createTenant(a.token, "ten-a");
    await createTenant(b.token, "ten-b");

    const listB = await (
      await get("/api/v1/tenants/list", { token: b.token })
    ).json();
    expect(listB).toHaveLength(1);
    expect(listB[0].slug).toBe("ten-b");
  });

  test("duplikat slug -> 409 CONFLICT", async () => {
    const a = await newUser();
    await createTenant(a.token, "acme");
    const res = await post(
      "/api/v1/tenants/create",
      { name: "Acme", slug: "acme" },
      { token: a.token },
    );
    expect(res.status).toBe(409);
  });
});

describe("izolacja Tenantów", () => {
  test("nie-członek nie ma dostępu do zasobów cudzego Tenanta -> 403", async () => {
    const a = await newUser();
    const b = await newUser();
    const tenantA = await createTenant(a.token, "ten-a");
    await createTenant(b.token, "ten-b");

    expect((await createCompany(a.token, tenantA.id)).status).toBe(201);

    // B ma poprawny token, ale nie jest członkiem Tenanta A.
    const res = await get("/api/v1/companies/list", {
      token: b.token,
      tenantId: tenantA.id,
    });
    expect(res.status).toBe(403);
    expect((await res.json()).error.message).toBe("NOT_A_MEMBER");
  });

  test("company widoczna tylko we własnym Tenancie", async () => {
    const a = await newUser();
    const tenantA = await createTenant(a.token, "ten-a");
    await createCompany(a.token, tenantA.id);

    const listA = await (
      await get("/api/v1/companies/list", {
        token: a.token,
        tenantId: tenantA.id,
      })
    ).json();
    expect(listA).toHaveLength(1);
  });

  test("branch nie podepnie się pod company spoza scope Tenanta -> 404", async () => {
    const a = await newUser();
    const b = await newUser();
    const tenantA = await createTenant(a.token, "ten-a");
    const tenantB = await createTenant(b.token, "ten-b");
    const company = await (await createCompany(a.token, tenantA.id)).json();

    // B jest członkiem B; company należy do A -> poza jego scope.
    const res = await post(
      "/api/v1/branches/create",
      { companyId: company.id, name: "Hack" },
      { token: b.token, tenantId: tenantB.id },
    );
    expect(res.status).toBe(404);
  });

  test("branch tworzy się pod własną company (+ domyślny timezone)", async () => {
    const a = await newUser();
    const tenantA = await createTenant(a.token, "ten-a");
    const company = await (await createCompany(a.token, tenantA.id)).json();

    const res = await post(
      "/api/v1/branches/create",
      { companyId: company.id, name: "Centrum" },
      { token: a.token, tenantId: tenantA.id },
    );
    expect(res.status).toBe(201);
    expect((await res.json()).timezone).toBe("Europe/Warsaw");
  });
});

describe("uprawnienia (role)", () => {
  test("employee może listować, ale nie tworzyć company", async () => {
    const owner = await newUser();
    const employee = await newUser();
    const tenant = await createTenant(owner.token, "ten-a");
    await addMember(tenant.id, employee.id, "employee");

    const view = await get("/api/v1/companies/list", {
      token: employee.token,
      tenantId: tenant.id,
    });
    expect(view.status).toBe(200);

    const create = await createCompany(employee.token, tenant.id);
    expect(create.status).toBe(403);
    expect((await create.json()).error.message).toBe("FORBIDDEN");
  });
});

describe("guardy", () => {
  test("brak x-tenant-id (zalogowany) -> 400 TENANT_REQUIRED", async () => {
    const a = await newUser();
    const res = await get("/api/v1/companies/list", { token: a.token });
    expect(res.status).toBe(400);
    expect((await res.json()).error.message).toBe("TENANT_REQUIRED");
  });

  test("walidacja -> 422 + details", async () => {
    const a = await newUser();
    const tenant = await createTenant(a.token, "ten-a");
    const res = await post(
      "/api/v1/companies/create",
      { name: "A" },
      { token: a.token, tenantId: tenant.id },
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(Array.isArray(body.error.details)).toBe(true);
  });
});
