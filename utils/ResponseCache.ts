import { Handler, RequestContext, SafeHandler } from "../server.ts"

export type CacheItem = { key: string, value: Response, dob: number }
export type CacheOptions = { lifetime: number}

/**
 * Response cacher, returns memoize function to be used on handler
 * @param options: { lifetime: number } - cache item lifetime in ms (defaults to Infinity)
 * @returns memoizeHandler: (handler: Handler) => memoizedHandler
 */
export class ResponseCache {
  lifetime: number
  items: Array<CacheItem> = []

  constructor(opts?: Partial<ResponseCache>) {
    this.lifetime = opts && opts.lifetime 
    ? opts.lifetime 
    : Infinity // <- this should not be infinity - calc value f
  }

  get(key: string): CacheItem | undefined {
    const item = this.items.find(item => item.key == key && Date.now() < item.dob + this.lifetime)
    if (item) return item
    return undefined
  }

  set(key: string, value: Response): CacheItem {
    const newItem: CacheItem = { key, value, dob: Date.now() }
    this.items = [ ...this.items.filter((item) => item.key !== key), newItem ]
    return newItem
  }

  memoize(fcn: Handler): SafeHandler {
    return async (ctx: RequestContext) => {
      const key = `${ctx.request.url}-${JSON.stringify(ctx.state)}`

      const cacheItem = this.get(key)
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
      const response = await fcn(ctx)
      this.set(key, response)

      return response.clone()
    }
  }
}