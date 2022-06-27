import { RequestContext } from "../server.ts"
import { createResponseCache, CacheOptions } from "../utils/cache.ts"

export const cacher = async (ctx: RequestContext, opts?: CacheOptions) => {
  const memoizeHandler = createResponseCache(opts)

  return await memoizeHandler(await ctx.next())
}