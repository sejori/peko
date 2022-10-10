import { RequestContext, Event } from "../server.ts"

/**
 * Logging middleware, awaits next() so logging happens after request is handled.
 * Uses ctx.server.logString and ctx.server.logEvent.
 * @param ctx: RequestContext
 * @param next: () => Promise<Response>
 * @returns Promise<void>
 */

  /**
   *  Returns promise to not block process
   * @param ctx: RequestContext
   * @param start: number
   * @param responseTime: number
   * @returns Promise<void>
   */
export const logger = async (ctx: RequestContext, next: () => Promise<Response>): Promise<void> => {
  const start = new Date();

  const response = await next();

  const status = response.status
  const cached = ctx.state.responseFromCache
  const request: Request | undefined = ctx.request
  // ^ can be undefined in certain test cases

  const requestEvent: Event = {
    id: `${ctx.request?.method}-${request?.url}-${start.toJSON()}`,
    type: "request",
    date: start,
    data: {
      ctx,
      response,
      responseTime: `${Date.now() - start.valueOf()}ms`,
    }
  }

  try {
    await ctx.server.logString(`[${requestEvent.date}] ${status} ${request?.method} ${request?.url} ${requestEvent.data.responseTime}${cached ? " (CACHED)" : ""}`)
  } catch (error) {
    console.log(error)
  }

  try {
    await ctx.server.logEvent(requestEvent)
  } catch (error) {
    console.log(error)
  }
}