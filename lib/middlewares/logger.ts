import { RequestContext, MiddlewareResult } from "../server.ts"
import { logRequest } from "../utils/log.ts"

/**
 * Peko logging middleware
 * @param ctx: RequestContext
 * @param next: () => MiddlewareResult (for cascading middleware)
 */
export const logger = async (ctx: RequestContext, next: () => MiddlewareResult) => {
  const start = Date.now()
  await next()
  logRequest(ctx, start, Date.now() - start)
}