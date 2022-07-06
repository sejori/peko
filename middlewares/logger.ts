import { RequestContext } from "../server.ts"

/**
 * Logging middleware, uses cascading middleware to call Peko.logRequest after request is handled
 * @param ctx: RequestContext
 * @param next: () => MiddlewareResult (for cascading middleware)
 */
export const logger = async (ctx: RequestContext, next: () => Promise<Response>) => {
  const start = Date.now()
  const response = await next()
  ctx.peko.logRequest(ctx, response, start, Date.now() - start)
}