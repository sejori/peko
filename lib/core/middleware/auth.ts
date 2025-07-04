import { Krypto } from "../utils/Krypto.ts";
import { Middleware } from "../types.ts";

export type AuthState<Payload = Record<string, unknown>> = {
  auth: Payload | null;
};

/**
 * Basic auth middleware, uses Krypto utility class to verify JWTs and add payload to state
 * Note: this middleware DOES NOT check expiry of token since that is payload specific.
 * @param crypto: Crypto instance to be used
 * @returns Middleware
 */
export function auth<S extends Record<string, unknown> = Record<string, unknown>>(
  krypto: Krypto,
  opts?: { cookie: string }
): Middleware<AuthState<S>> {
  return async function authMiddleware(ctx, next) {
    let token = opts
      ? ctx.request.headers.get("Cookies") //!.cookie // <- fix
      : ctx.request.headers.get("Authorization");

    if (token) {
      if (token.slice(0, 7) === "Bearer ") token = token.slice(7);

      const payload = await krypto.verify(token);

      if (payload) {
        ctx.state.auth = payload as S;
        return next();
      }
    }

    ctx.state.auth = null;
  };
};
