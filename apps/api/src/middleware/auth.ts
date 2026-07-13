import { createMiddleware } from "hono/factory";

import { verifyToken } from "../core/auth/verifier";

/**
 * Jeśli w żądaniu jest `Authorization: Bearer <token>`, weryfikuje go i zapisuje
 * userId w kontekście. Brak tokenu = żądanie anonimowe (guardy odrzucą chronione
 * trasy). Niepoprawny token = 401 (rzucone przez verifyToken).
 */
export const auth = createMiddleware(async (c, next) => {
  const header = c.req.header("authorization");

  if (header?.startsWith("Bearer ")) {
    const claims = await verifyToken(header.slice(7));
    c.set("userId", claims.sub);
  }

  await next();
});
