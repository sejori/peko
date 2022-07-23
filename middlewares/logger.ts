import { MiddlewareResult, RequestContext } from "../server.ts"

/**
 * Logging middleware, awaits next() so logRequest happens after request is handled
 * @param ctx: RequestContext
 * @param next: () => MiddlewareResult (for cascading middleware)
 */
export const logger = async (ctx: RequestContext, next: () => Promise<Response>): Promise<MiddlewareResult> => {
  const start = Date.now()
  const response = await next()
  ctx.server.logRequest(ctx, response, start, Date.now() - start)
}