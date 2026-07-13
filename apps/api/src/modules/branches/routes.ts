import { createRoute } from "@hono/zod-openapi";

import {
  BranchListResponseSchema,
  BranchResponseSchema,
  CreateBranchSchema,
} from "@repo/contracts";

export const createBranchRoute = createRoute({
  method: "post",

  path: "/create",

  tags: ["Branches"],

  summary: "Create branch",

  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBranchSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Branch created",

      content: {
        "application/json": {
          schema: BranchResponseSchema,
        },
      },
    },
  },
});

export const listBranchesRoute = createRoute({
  method: "get",

  path: "/list",

  tags: ["Branches"],

  summary: "List branches",

  responses: {
    200: {
      description: "Branches listed",

      content: {
        "application/json": {
          schema: BranchListResponseSchema,
        },
      },
    },
  },
});
