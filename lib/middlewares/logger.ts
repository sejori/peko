import { RequestContext, MiddlewareResult } from "../server.ts"
import { logRequest } from "../utils/log.ts"

export const logger = async (ctx: RequestContext, next: () => MiddlewareResult) => {
  const start = Date.now()
  await next()
  await new Promise(res => setTimeout(res, 2000))
  logRequest(ctx, ctx.status, start, Date.now() - start)
}