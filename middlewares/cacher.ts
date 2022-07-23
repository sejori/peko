import { RequestContext } from "../server.ts"
import { ResponseCache } from "../utils/ResponseCache.ts";

const { memoize } = new ResponseCache()

/**
 * Caching middleware, uses ResponseCache utility
 * @param ctx: RequestContext
 * @returns MiddlewareResponse
 */
export const cacher = async (ctx: RequestContext, next: () => Promise<Response>): Promise<Response> => {
  return await memoize(next)(ctx)
}