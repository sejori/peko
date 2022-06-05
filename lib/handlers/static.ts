import { addRoute } from "../server.ts"
import { StaticRoute } from "../types.ts"
import { getConfig } from "../config.ts"
import { createResponseCache } from "../utils/cacher.ts"
import { hasher } from "../utils/hasher.ts"

/**
 * Static asset request handler
 * 
 * @param staticData: StaticRoute
 * @returns Promise<Response>
 */
export const staticHandler = async (staticData: StaticRoute) => {
  let filePath = decodeURI(staticData.fileURL.pathname)
  
  // fix annoying windows paths
  if (Deno.build.os === "windows") filePath = filePath.substring(1)

  // Is it more efficient to stream file into response body?
  const body = await Deno.readFile(filePath)
  const hashString = hasher(body.toString())

  return new Response(body, {
    headers: new Headers({
      'Content-Type': staticData.contentType ? staticData.contentType : 'text/plain',
      'Cache-Control': 'public, max-age=31536000',
      // create hash for ETag
      // this lets browser check if file has changed by returning ETag in "if-none-match" header.
      // devMode: new ETag in each response so no browser caching
      // not devMode + memoized: ETag matches "if-none-match" header so 304 (not modified) response given
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
export const addStaticRoute = (staticRouteData: StaticRoute) => {
  const config = getConfig()

  const memoizeHandler = createResponseCache() 

  const cachedStaticHandler = memoizeHandler(() => staticHandler(staticRouteData))

  return addRoute({
    route: staticRouteData.route,
    method: "GET",
    middleware: staticRouteData.middleware,
    handler: async (request, _params) => !config.devMode
      ? await cachedStaticHandler(request)
      : await staticHandler(staticRouteData)
  })
}