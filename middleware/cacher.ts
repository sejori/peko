import { Middleware } from "../types.ts"
import { ResponseCache } from "../utils/ResponseCache.ts";

/**
 * Cache and serve responses using provided ResponseCache
 * @param cache: ResponseCache
 * @returns Middleware
 */
export const cacher = (cache: ResponseCache): Middleware => async (ctx, next) => {
  const reqURL = new URL(ctx.request.url)
  const key = `${reqURL.pathname}${reqURL.search}-${JSON.stringify(ctx.state)}`

  const cacheItem = cache.get(key)

  if (cacheItem) {
    // ETag match triggers 304
    const ifNoneMatch = ctx.request.headers.get("if-none-match")
    const ETag = cacheItem.value.headers.get("ETag")

    if (ETag && ifNoneMatch?.includes(ETag)) {
      ctx.state.responseFromCache = true
      return new Response(null, {
        headers: cacheItem.value.headers,
        status: 304
      })
    }

    ctx.state.responseFromCache = true
    return cacheItem.value.clone()
  }

  const response = await next()
  if (!response) return
  
  const newCacheItem = cache.set(key, response.clone())
  return newCacheItem.value.clone()
}