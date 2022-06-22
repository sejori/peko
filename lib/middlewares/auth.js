import { config } from "../config.ts"
import { decodeJWT } from "../utils/jwt.ts"

export const authMiddleware = (ctx) => {
  const authHeader = ctx.request.headers.get("Authorization")
  if (authHeader && authHeader.slice(0,7) === "Bearer ") {
    const jwt = authHeader.slice(7)
    const payload = decodeJWT(jwt)
    if (payload && (!payload.exp || payload.exp < Date.now())) {
      ctx.data.auth.payload = payload
      return
    }
  }
  
  return config.handleError(ctx, 401)
}

// {
//   user: userId,
//   data: { /* ... */ },
//   exp: expiry.valueOf()
// }