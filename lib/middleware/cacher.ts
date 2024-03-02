import { CacheItem, defaultKeyGen } from "../utils/CacheItem.ts";
import { Middleware } from "../types.ts";

interface CacheOptions {
  itemLifetime?: number;
  keyGen?: typeof defaultKeyGen;
  store?: {
    get: (
      key: string
    ) => Promise<CacheItem | undefined> | CacheItem | undefined;
    set: (key: string, value: CacheItem) => Promise<unknown> | unknown;
    delete: (key: string) => Promise<unknown> | unknown;
  };
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
  const items: CacheItem[] = [];
  const getKey = opts && opts.keyGen ? opts.keyGen : defaultKeyGen;
  const getItem = (key: string) =>
    opts && opts.store ? opts.store.get(key) : items.find((i) => i.key === key);

  const setItem = (key: string, value: CacheItem) =>
    opts && opts.store
      ? opts.store.set(key, value)
      : (items.push(value), undefined);

  const deleteItem = (key: string) =>
    opts && opts.store
      ? opts.store.delete(key)
      : (items.splice(
          items.findIndex((i) => i.key === key),
          1
        ),
        undefined);

  return async function cacheMiddleware(ctx, next) {
    const key = getKey(ctx);
    const cacheItem = await getItem(key);

    if (cacheItem) {
      if (
        opts &&
        opts.itemLifetime &&
        Date.now() > cacheItem.dob + opts.itemLifetime
      ) {
        deleteItem(key);
      } else {
        // ETag match triggers 304
        const ifNoneMatch = ctx.request.headers.get("if-none-match");
        const ETag = cacheItem.value.headers.get("ETag");
        setItem(key, { ...cacheItem, count: cacheItem.count + 1 });

        if (ETag && ifNoneMatch?.includes(ETag)) {
          ctx.state.responseFromCache = true;
          return new Response(null, {
            headers: cacheItem.value.headers,
            status: 304,
          });
        }

        ctx.state.responseFromCache = true;
        return cacheItem.value.clone();
      }
    }

    const response = await next();
    if (!response) return;

    const newCacheItem = new CacheItem(
      opts && opts.keyGen ? opts.keyGen(ctx) : defaultKeyGen(ctx),
      response
    );

    setItem(newCacheItem.key, newCacheItem);

    return newCacheItem.value.clone();
  };
};
