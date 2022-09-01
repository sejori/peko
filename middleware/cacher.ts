import { RequestContext, Middleware } from "../server.ts"
import { ResponseCache } from "../utils/ResponseCache.ts";

/**
 * Generates a caching middleware using provided ResponseCache instance
 * @param cache: ResponseCache
 * @returns Middleware
 */
export const cacher = (cache: ResponseCache): Middleware => (
  ctx: RequestContext, 
  next: () => Promise<Response>
): Promise<Response> => cache.memoize(next)(ctx)