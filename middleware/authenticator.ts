import { Middleware } from "../types.ts"
import { Crypto } from "../utils/Crypto.ts"

/**
 * Auth middleware, uses Crypto utility class to verify JWTs
 * @param crypto: Crypto instance to be used
 * @returns Middleware
 */
export const authenticator = (crypto: Crypto, opts?: { cookie: string }): Middleware => async (ctx, next) => {
  let token = opts
    ? ctx.request.headers.get("Cookies") //!.cookie // <- fix
    : ctx.request.headers.get("Authorization")
  
  if (token) {
    if (token.slice(0,7) === "Bearer ") token = token.slice(7)

    const payload = await crypto.verify(token)

    if (payload) {
      ctx.state.auth = payload
      return next()
    }
  }
  
  return new Response(null, { status: 401 })
}