import { addRoute, RequestContext, Middleware } from "../server.ts"
import { config } from "../config.ts"
import { createResponseCache } from "../utils/cache.ts"
import { hasher } from "../utils/hash.ts"

export type StaticRoute = { 
  route: string
  middleware?: Middleware[] | Middleware
  fileURL: URL
  contentType: string | undefined
}

/**
 * Static asset request handler
 * 
 * @param staticData: StaticRoute
 * @returns Promise<Response>
 */
export const staticHandler = async (_ctx: RequestContext, staticData: StaticRoute) => {
  let filePath = decodeURI(staticData.fileURL.pathname)
  
  // fix annoying windows paths
  if (Deno.build.os === "windows") filePath = filePath.substring(1)

  // Is it more efficient to stream file into response body?
  const body = await Deno.readFile(filePath)
  const hashString = await hasher(body.toString())

  return new Response(body, {
    headers: new Headers({
      'Content-Type': staticData.contentType ? staticData.contentType : 'text/plain',
      // tell browser not to cache if in devMode
      'Cache-Control': config.devMode
        ? 'no-store'
        : 'max-age=604800, stale-while-revalidate=86400',
      // create ETag hash so 304 (not modified) response can be given from cacher
      'ETag': hashString
    })
  })
}

/**
 * Add a route that uses the static handler and Response cache.
 * 
 * @param staticRouteData { 
    route: string - e.g. "favicon.png"
    middleware?: Middleware (optional)
    fileURL: URL - e.g. new URL("./assets/favicon.png")
    contentType: string - e.g. "image/png"
 * }
 */
export const addStaticRoute = (staticData: StaticRoute) => {
  const memoizeHandler = createResponseCache() 

  const cachedStaticHandler = memoizeHandler((ctx) => staticHandler(ctx, staticData))

  return addRoute({
    route: staticData.route,
    method: "GET",
    middleware: staticData.middleware,
    handler: async (ctx) => !config.devMode
      ? await cachedStaticHandler(ctx)
      : await staticHandler(ctx, staticData)
  })
}