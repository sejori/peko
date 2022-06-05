import { Handler, HandlerParams } from "../types.ts"

export type CacheItem = { key: string, value: Response, dob: number }
export type CacheOptions = { lifetime: number, debug: boolean }

/**
 * Peko's internal Response cache logic. 
 * 
 * Lifetime invalidates cache items if they've existed beyond it. In Milliseconds.
 * Fallsback to config.defaultCacheLifetime if not provided.
 * 
 * @param options: { lifetime: number }
 * @returns memoizeHandler: (handlerFcn) => cachedEnabledHandlerFcn
 */
export const createResponseCache = (options?: Partial<CacheOptions>) => {
  // should this be a class or a closure?
  // class would be more general-purpose as can access private vars etc
  // but closure is more sleek and inline with project conventions

  let cache: Array<CacheItem> = []
  const lifetime = options && options.lifetime 
    ? options.lifetime 
    : Infinity

  const getLatestCacheItem = (key: string) => {
    // return first valid item if found
    const validItems = cache.filter(item => item.key == key && Date.now() < item.dob + lifetime)
    if (validItems.length) return validItems[validItems.length - 1]
    return undefined
  }

  const updateCache = async (key: string, value: Response) => await new Promise((resolve: (value: void) => void) => {
    // remove matching items from cache if present
    cache = cache.filter((item) => item.key !== key)

    // add new item into cache
    cache.push({ key, value, dob: Date.now() })

    return resolve()
  })

  const memoizeHandler = (fcn: Handler) => {
    return async (request: Request, params: HandlerParams = {}) => {
      const key = `${request.url}-${JSON.stringify(params)}`

      const latest = getLatestCacheItem(key)
      if (latest) {
        // ETag match triggers 304
        const ifNoneMatch = request.headers.get("if-none-match")
        const ETag = latest.value.headers.get("ETag")
        if (ETag && ifNoneMatch?.includes(ETag)) {
          return new Response(null, {
            headers: latest.value.headers,
            status: 304
          })
        }

        // else respond 200 clone of response - one-use original lives in cache
        return latest.value.clone()
      }

      // calc new value then update cache asynchronously to not block process before return
      const response = await fcn(request, params)
      updateCache(key, response)

      return response.clone()
    }
  }

  return memoizeHandler
}