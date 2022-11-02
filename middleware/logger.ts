import { RequestContext } from "../server.ts"

/**
 * Ctx.server.log middleware, awaits next() so logging happens after request is handled.
 * @param ctx: RequestContext
 * @param next: () => Promise<Response>
 * @returns Promise<void>
 */
export const logger = async (ctx: RequestContext, next: () => Promise<Response>): Promise<void> => {
  const start = new Date();

  const response = await next();

  const responseTime = `${Date.now() - start.valueOf()}ms`
  const status = response.status
  const cached = ctx.state.responseFromCache
  const request: Request | undefined = ctx.request
  // ^ can be undefined in certain test cases

  await ctx.server.log(`[${start}] ${status} ${request?.method} ${request?.url} ${responseTime}${cached ? " (CACHED)" : ""}`)
}