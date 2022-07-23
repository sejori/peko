import { RequestContext } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

const crypto = new Crypto({ key: "SUPER_SECRET_KEY_123" }) // <-- should come from env

export interface Payload {
  iat: number
  exp: number
  data: Record<string, string>
}

/**
 * Auth middleware, uses Crypto utility class for JWTs with expiry
 * @param ctx: RequestContext
 * @returns MiddlewareResponse
 */
export const authenticator = async (ctx: RequestContext): Promise<Response | void>=> {
  const authHeader = ctx.request.headers.get("Authorization")

  if (authHeader && authHeader.slice(0,7) === "Bearer ") {
    const jwt = authHeader.slice(7)
    const payload: Payload | undefined = await crypto.verify(jwt)
    if (payload && (!payload.exp || payload.exp > Date.now())) {
      ctx.state.authPayload = payload
      return
    }
  }
  
  return await ctx.server.handleError(ctx, 401)
}