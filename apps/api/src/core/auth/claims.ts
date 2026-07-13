/** Minimalny zestaw oświadczeń z tokenu, na których polega aplikacja. */
export type AuthClaims = {
  sub: string;
  email?: string;
};
