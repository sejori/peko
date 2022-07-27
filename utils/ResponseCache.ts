import { Handler, RequestContext, SafeHandler } from "../server.ts"

export class CacheItem { 
  key: string
  value: Response
  dob: number
  count: number

  constructor(key: string, value: Response) {
    this.key = key
    this.value = value
    this.dob = Date.now()
    this.count = 0
  }

  useRate() {
    return this.count / (Date.now() - this.dob)
  }
}

export interface CacheOptions { 
  lifetime?: number
  memoryLimit?: number
}

/**
 * Response caching class, provides memoize method to be used on handlers or next() in middleware
 * @param options: { lifetime: number } - cache item lifetime in ms (defaults to Infinity)
 * @returns memoizeHandler: (handler: Handler) => memoizedHandler
 */
export class ResponseCache {
  items: Array<CacheItem> = []
  lifetime: number
  MEMORY_LIMIT: number

  constructor(opts?: CacheOptions) {
    this.lifetime = opts && opts.lifetime 
      ? opts.lifetime 
      : Infinity

    this.MEMORY_LIMIT = opts && opts.memoryLimit 
      ? opts.memoryLimit 
      : 128 * 1024 * 1024
  }

  get(key: string): CacheItem | undefined {
    const item = this.items.find(item => item.key == key && Date.now() < item.dob + this.lifetime)
    if (item) {
      item.count++
      return item
    }
    return undefined
  }

  async set(key: string, value: Response): Promise<CacheItem> {
    await this.clean()

    const newItem = new CacheItem(key, value)
    this.items = [ ...this.items.filter((item) => item.key !== key), newItem ]

    return newItem
  }

  clean(): Promise<void> {
    return new Promise<void>((res) => {
      if (Deno.memoryUsage().heapTotal < this.MEMORY_LIMIT) return res()
      
      this.items.sort((item1, item2) => item1.useRate() < item2.useRate() ? 1 : 0) 
      this.items.splice(Math.floor(this.items.length/2))
      return res()
    })
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