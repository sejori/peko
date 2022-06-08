import { addRoute } from "../server.ts"
import { getConfig } from "../config.ts"
import { createResponseCache } from "../utils/cacher.ts"
import { HandlerParams, SSRRoute } from "../types.ts"
import { hasher } from "../utils/hasher.ts"

/**
 * SSR request handler complete with JS app rendering, HTML templating & response caching logic. 
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ssrData: SSRRoute, request: Request, params: HandlerParams) => {
  // TODO: emit srcURL file change events from watcher worker

  // use provided render and template fcns for HTML generation
  const HTML = await ssrData.render(request, params)    
  const hashString = hasher(HTML)

  return new Response(HTML, {
    headers : new Headers({
      'Content-Type': 'text/html; charset=utf-8',
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
 * Add a route that uses the ssr handler and Response cache.
 * 
 * See "lib/types.ts" for Template, Render & CustomTags type details
 * 
 * @param ssrRouteData { 
    route: string - e.g. "/home"
    middleware?: Middleware (optional)
    template: Template - e.g. (ssrResult, customTags, request) => `<!DOCTYPE html><html><head>${customTags.title}</head><body>${ssrResult}</body></html>`
    render: Render - e.g. (app) => renderToString(app())
    moduleURL: URL - e.g. new URL("./src/home.js")
    customTags?: CustomTags - e.g. () => ({ title: <title>Home Page!</title> })
    cacheLifetime?: number - e.g. 3600000
 * }
*/
export const addSSRRoute = (ssrRouteData: SSRRoute) => {
  const config = getConfig()

  const memoizeHandler = createResponseCache({
    lifetime: ssrRouteData.cacheLifetime
  }) 

  const cachedSSRHandler = memoizeHandler((request, params) => ssrHandler(ssrRouteData, request, params))

  return addRoute({
    route: ssrRouteData.route,
    method: "GET",
    middleware: ssrRouteData.middleware,
    handler: async (request, params) => !config.devMode
      // use cache-enabled fcn if not in prod env and pass in params 
      // so we cache renders by params as well as SSRRoute data
      ? await cachedSSRHandler(request, params)
      : await ssrHandler(ssrRouteData, request, params)
  })
}