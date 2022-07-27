import { RequestContext } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

const crypto = new Crypto({ key: "SUPER_SECRET_KEY_123" }) // <-- should come from env

// export interface Payload {
//   iat: number
//   exp: number
//   data: Record<string, string>
// }

/**
 * Auth middleware, uses Crypto utility class for JWTs with expiry
 * @param ctx: RequestContext
 * @returns MiddlewareResponse
 */
export const authenticator = async (ctx: RequestContext): Promise<Response | void>=> {
  const authHeader = ctx.request.headers.get("Authorization")

  // check JWT from cookies
  if (authHeader && authHeader.slice(0,7) === "Bearer ") {
    const jwt = authHeader.slice(7)
    const payload = await crypto.verify(jwt)
    if (typeof payload?.exp === "number" && payload.exp > Date.now()) {
      ctx.state.auth = payload
      return
    }
  }

  // otherwise create anonymous session
  
  
  return await ctx.server.handleError(ctx, 401)
}