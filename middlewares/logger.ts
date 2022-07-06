import { RequestContext } from "../server.ts"

/**
 * Peko logging middleware
 * @param ctx: RequestContext
 * @param next: () => MiddlewareResult (for cascading middleware)
 */
export const logger = async (ctx: RequestContext, next: () => Promise<Response>) => {
  const start = Date.now()
  const response = await next()
  ctx.peko.logRequest(ctx, response, start, Date.now() - start)
}