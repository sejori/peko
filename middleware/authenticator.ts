import { Middleware } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

/**
 * Auth middleware, uses Crypto utility class to verify JWTs
 * @param crypto: Crypto instance to be used
 * @returns Middleware
 */
export const authenticator = (crypto: Crypto): Middleware => async (ctx, next) => {
  const authHeader = ctx.request.headers.get("Authorization")

  // check JWT from cookies
  if (authHeader && authHeader.slice(0,7) === "Bearer ") {
    const jwt = authHeader.slice(7)
    const payload = await crypto.verify(jwt)
    if (payload) {
      ctx.state.auth = payload
      return next()
    }
  }  
  
  return new Response(null, { status: 401 })
}