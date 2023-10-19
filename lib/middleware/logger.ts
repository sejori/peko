import { Middleware } from "../types.ts"

/**
 * Generic request info logging middleware. Awaits next() so log happens post request handling.
 * @param log: (input: unknown) => unknown)
 * @returns Middleware
 */
export const logger = (log: (input: unknown) => unknown): Middleware => {
  return async function logMiddleware (ctx, next) {
    const start = new Date();

    const response = await next();

    const responseTime = `${Date.now() - start.valueOf()}ms`
    const status = response ? response.status : "404 (No Reponse)"
    const cached = ctx.state.responseFromCache
    const request = ctx.request

    await log(`[${start}] ${status} ${request.method} ${request.url} ${responseTime}${cached ? " (CACHED)" : ""}`)
  }
}