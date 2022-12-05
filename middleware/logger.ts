import { Middleware } from "../server.ts"

/**
 * Generic request info logging middleware. Awaits next() so log happens post request handling.
 * @param log: (input: unknown) => unknown)
 * @returns Middleware
 */
export const logger = (log: (input: unknown) => unknown): Middleware => async (ctx, next) => {
  const start = new Date();

  const response = await next();

  const responseTime = `${Date.now() - start.valueOf()}ms`
  const status = response.status
  const cached = ctx.state.responseFromCache
  const request: Request | undefined = ctx.request
  // ^ can be undefined in certain test cases

  await log(`[${start}] ${status} ${request?.method} ${request?.url} ${responseTime}${cached ? " (CACHED)" : ""}`)
}