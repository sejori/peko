import { Middleware } from "../server.ts"
import { ResponseCache } from "../utils/ResponseCache.ts";

/**
 * Cache and serve responses using provided ResponseCache
 * @param cache: ResponseCache
 * @returns Middleware
 */
export const cacher = (cache: ResponseCache): Middleware => async (ctx, next) => {
  const key = `${new URL(ctx.request.url).pathname}-${JSON.stringify(ctx.state)}`

  const cacheItem = cache.get(key)

  if (cacheItem) {
    // ETag match triggers 304
    const ifNoneMatch = ctx.request.headers.get("if-none-match")
    const ETag = cacheItem.value.headers.get("ETag")

    if (ETag && ifNoneMatch?.includes(ETag)) {
      return new Response(null, {
        headers: cacheItem.value.headers,
        status: 304
      })
    }

    // else respond 200 clone of response - one-use original lives in cache
    ctx.state.responseFromCache = true
    return cacheItem.value.clone()
  }

  // update cache asynchronously to not block process before return
  const response = await next()
  
  cache.set(key, response.clone())
  return response.clone()
}