import { Middleware } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

/**
 * Auth middleware, uses Crypto utility class to verify JWTs
 * @param crypto: Crypto instance to be used
 * @returns Middleware
 */
export const authenticator = (crypto: Crypto, opts?: { cookie: string }): Middleware => async (ctx, next) => {
  let token = ''
  
  if (opts) {
    token = ctx.request.headers.get("Cookies") || "" // <-- get cookie name somehow
  } else {
    const authHeader = ctx.request.headers.get("Authorization")
    if (authHeader && authHeader.slice(0,7) === "Bearer ") {
      token = authHeader.slice(7)
    }
  }

  const payload = await crypto.verify(token)

  if (payload) {
    ctx.state.auth = payload
    return next()
  }
  
  return new Response(null, { status: 401 })
}