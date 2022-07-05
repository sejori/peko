import { RequestContext, MiddlewareResult } from "../server.ts"

/**
 * Peko logging middleware
 * @param ctx: RequestContext
 * @param next: () => MiddlewareResult (for cascading middleware)
 */
export const logger = async (ctx: RequestContext, next: () => MiddlewareResult) => {
  const start = Date.now()
  await next()
  ctx.peko.logRequest(ctx, start, Date.now() - start)
}