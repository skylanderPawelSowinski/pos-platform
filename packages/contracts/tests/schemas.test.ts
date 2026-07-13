import { describe, expect, test } from "bun:test";

import {
  CreateBranchSchema,
  CreateCompanySchema,
  CreateTenantSchema,
} from "../src";

describe("CreateTenantSchema", () => {
  test("akceptuje poprawne dane", () => {
    const r = CreateTenantSchema.safeParse({ name: "Acme", slug: "acme-1" });
    expect(r.success).toBe(true);
  });

  test("odrzuca slug z wielkimi literami / spacją", () => {
    expect(
      CreateTenantSchema.safeParse({ name: "Acme", slug: "Acme X" }).success,
    ).toBe(false);
  });

  test("odrzuca za krótką nazwę", () => {
    expect(
      CreateTenantSchema.safeParse({ name: "A", slug: "acme" }).success,
    ).toBe(false);
  });

  test("przycina białe znaki w nazwie", () => {
    const r = CreateTenantSchema.parse({ name: "  Acme  ", slug: "acme" });
    expect(r.name).toBe("Acme");
  });
});

describe("CreateCompanySchema", () => {
  test("akceptuje samą nazwę (pola opcjonalne)", () => {
    expect(CreateCompanySchema.safeParse({ name: "Acme" }).success).toBe(true);
  });

  test("odrzuca niepoprawny email", () => {
    expect(
      CreateCompanySchema.safeParse({ name: "Acme", email: "not-an-email" })
        .success,
    ).toBe(false);
  });
});

describe("CreateBranchSchema", () => {
  test("wymaga companyId w formacie uuid", () => {
    expect(
      CreateBranchSchema.safeParse({ companyId: "nope", name: "Centrum" })
        .success,
    ).toBe(false);
  });

  test("akceptuje poprawny companyId + nazwę", () => {
    expect(
      CreateBranchSchema.safeParse({
        companyId: "550e8400-e29b-41d4-a716-446655440000",
        name: "Centrum",
      }).success,
    ).toBe(true);
  });
});
