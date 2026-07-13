import { env as sharedEnv } from "@repo/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  extends: [sharedEnv],

  server: {
    PORT: z.coerce.number().default(3000),

    // HS256 dev/test. Gdy ustawione zmienne COGNITO_* poniżej — weryfikator
    // przełącza się na JWKS (RS256). Patrz core/auth/verifier.ts.
    AUTH_JWT_SECRET: z.string().min(1).default("dev-secret-change-me"),

    // Cognito (opcjonalne). Ustawienie REGION + USER_POOL_ID włącza tryb JWKS.
    COGNITO_REGION: z.string().optional(),
    COGNITO_USER_POOL_ID: z.string().optional(),
    // Weryfikowane jako `aud` (ID token). Pomiń, jeśli nie chcesz sprawdzać aud.
    COGNITO_CLIENT_ID: z.string().optional(),
  },

  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
});
