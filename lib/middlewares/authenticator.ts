import { RequestContext } from "../server.ts"
import { config } from "../config.ts"
import { decodeJWT } from "../utils/jwt.ts"

export const authenticator = async (ctx: RequestContext) => {
  const authHeader = ctx.request.headers.get("Authorization")

  if (authHeader && authHeader.slice(0,7) === "Bearer ") {
    const jwt = authHeader.slice(7)
    const payload = await decodeJWT(jwt)
    if (payload && (!payload.exp || payload.exp > Date.now())) {
      ctx.data.authPayload = payload
      return
    }
  }
  
  return await config.handleError(ctx, 401)
}