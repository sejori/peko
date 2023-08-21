import { CacheItem, defaultKeyGen } from "../utils/CacheItem.ts";
import { Middleware } from "../types.ts";

interface CacheOptions {
  itemLifetime?: number
  keyGen?: typeof defaultKeyGen
  store?: {
    get: (key: string) => Promise<CacheItem | undefined> | CacheItem | undefined
    set: (key: string, value: CacheItem) => Promise<unknown> | unknown
    delete: (key: string) => Promise<unknown> | unknown
  }
}

/**
 * Configurable response cache for router, items stored in memory or via supplied options
 * 
 * ```
 * interface CacheOptions {
 *   itemLifetime?: number
 *   keyGen?: typeof defaultKeyGen
 *   store?: {
 *     get: (key: string) => Promise<CacheItem | undefined> | CacheItem | undefined
 *     set: (key: string, value: CacheItem) => Promise<unknown> | unknown
 *     delete: (key: string) => Promise<unknown> | unknown
 *   }
 * }
 * ```
 * 
 * @param cacheOptions: CacheOptions
 * @returns cacheMiddleware: Middleware
 */
export const cacher = (opts?: CacheOptions): Middleware => {
  let items: CacheItem[] = [] // default items array

  return async function cacheMiddleware (ctx, next) {
    const key = opts && opts.keyGen 
      ? opts.keyGen(ctx)
      : defaultKeyGen(ctx);

    const cacheItem = opts && opts.store 
      ? await opts.store.get(key)
      : items.find(i => i.key === key)

    if (cacheItem) {
      if (opts && opts.itemLifetime && Date.now() > cacheItem.dob + opts.itemLifetime) {
        if (opts && opts.store) opts.store.delete(key)
        else items = [ ...items.filter(i => i.key !== key) ]
      } else {
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
    }

    const response = await next()
    if (!response) return

    const newCacheItem = new CacheItem(
      opts && opts.keyGen 
        ? opts.keyGen(ctx) 
        : defaultKeyGen(ctx), 
      response
    )

    opts && opts.store
      ? opts.store.set(key, newCacheItem)
      : items = [ ...items.filter(i => i.key !== key), newCacheItem ]

    return newCacheItem.value.clone()
  }
}