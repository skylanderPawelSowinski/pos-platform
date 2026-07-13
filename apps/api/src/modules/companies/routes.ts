import { createRoute } from "@hono/zod-openapi";

import {
  CompanyListResponseSchema,
  CompanyResponseSchema,
  CreateCompanySchema,
} from "@repo/contracts";

export const createCompanyRoute = createRoute({
  method: "post",

  path: "/create",

  tags: ["Companies"],

  summary: "Create company",

  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCompanySchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Company created",

      content: {
        "application/json": {
          schema: CompanyResponseSchema,
        },
      },
    },
  },
});

export const listCompaniesRoute = createRoute({
  method: "get",

  path: "/list",

  tags: ["Companies"],

  summary: "List companies",

  responses: {
    200: {
      description: "Companies listed",

      content: {
        "application/json": {
          schema: CompanyListResponseSchema,
        },
      },
    },
  },
});
