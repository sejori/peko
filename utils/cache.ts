import { RequestContext, Handler } from "../server.ts"

export type CacheItem = { key: string, value: Response, dob: number }
export type CacheOptions = { lifetime: number, debug: boolean }

/**
 * Response cacher, returns memoize functin to be used on handler
 * @param options: { lifetime: number } - lifetime defaults to Infinity
 * @returns memoizeHandler: (handler: Handler) => memoizedHandler
 */
export const createResponseCache = (options?: Partial<CacheOptions>) => {
  let cache: Array<CacheItem> = []
  const lifetime = options && options.lifetime 
    ? options.lifetime 
    : Infinity

  const getLatestCacheItem = (key: string) => {
    const validItems = cache.filter(item => item.key == key && Date.now() < item.dob + lifetime)
    if (validItems.length) return validItems[validItems.length - 1]
    return undefined
  }

  const updateCache = async (key: string, value: Response) => await new Promise((resolve: (value: void) => void) => {
    cache = cache.filter((item) => item.key !== key)
    cache.push({ key, value, dob: Date.now() })

    return resolve()
  })

  const memoize = (fcn: Handler) => {
    return async (ctx: RequestContext) => {
      const key = `${ctx.request.url}-${JSON.stringify(ctx.state)}`

      const latest = getLatestCacheItem(key)
      if (latest) {
        // ETag match triggers 304
        const ifNoneMatch = ctx.request.headers.get("if-none-match")
        const ETag = latest.value.headers.get("ETag")

        if (ETag && ifNoneMatch?.includes(ETag)) {
          ctx.state.cached = true
          return new Response(null, {
            headers: latest.value.headers,
            status: 304
          })
        }

        // else respond 200 clone of response - one-use original lives in cache
        ctx.state.cached = true
        return latest.value.clone()
      }

      // update cache asynchronously to not block process before return
      const response = await fcn(ctx)
      updateCache(key, response)

      ctx.state.cached = false
      return response.clone()
    }
  }

  return memoize
}