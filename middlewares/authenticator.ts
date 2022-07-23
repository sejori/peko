import { MiddlewareResult, RequestContext } from "../server.ts"

/**
 * JWT auth middleware, uses decodeJWT utility
 * @param ctx: RequestContext
 * @returns MiddlewareResponse
 */
export const authenticator = async (ctx: RequestContext): Promise<MiddlewareResult>=> {
  const authHeader = ctx.request.headers.get("Authorization")

  if (authHeader && authHeader.slice(0,7) === "Bearer ") {
    const jwt = authHeader.slice(7)
    const payload = await ctx.server.crypto.verify(jwt)
    if (payload && (!payload.exp || payload.exp > Date.now())) {
      ctx.state.authPayload = payload
      return
    }
  }
  
  return await ctx.server.handleError(ctx, 401)
}