import { verify, verifyWithJwks } from "hono/jwt";

import { env } from "../../config/env";
import { UnauthorizedError } from "../errors";
import type { AuthClaims } from "./claims";

/**
 * Konfiguracja Cognito wyliczana z env. Gdy null — działa tryb HS256 (dev/test).
 */
const cognito =
  env.COGNITO_REGION && env.COGNITO_USER_POOL_ID
    ? {
        issuer: `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`,
      }
    : null;

const RS256 = ["RS256"] as const;

async function verifyPayload(
  token: string,
): Promise<Awaited<ReturnType<typeof verify>>> {
  if (cognito) {
    // Produkcja: RS256 przez JWKS Cognito, walidacja iss (+ aud dla ID tokenu).
    return verifyWithJwks(token, {
      jwks_uri: `${cognito.issuer}/.well-known/jwks.json`,
      allowedAlgorithms: RS256,
      verification: {
        iss: cognito.issuer,
        ...(env.COGNITO_CLIENT_ID ? { aud: env.COGNITO_CLIENT_ID } : {}),
      },
    });
  }

  // Dev/test: HS256 z sekretem — tokeny mintujemy lokalnie.
  return verify(token, env.AUTH_JWT_SECRET, "HS256");
}

/**
 * Weryfikuje token i zwraca zaufane oświadczenia. Tryb (HS256 vs Cognito/JWKS)
 * zależy wyłącznie od env — reszta aplikacji jest niezależna od dostawcy.
 */
export async function verifyToken(token: string): Promise<AuthClaims> {
  let payload: Awaited<ReturnType<typeof verify>>;

  try {
    payload = await verifyPayload(token);
  } catch {
    throw new UnauthorizedError("INVALID_TOKEN");
  }

  if (typeof payload.sub !== "string") {
    throw new UnauthorizedError("INVALID_TOKEN");
  }

  return {
    sub: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
  };
}
