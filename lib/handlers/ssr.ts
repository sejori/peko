import { addRoute, RequestContext, Middleware } from "../server.ts"
import { config } from "../config.ts"
import { createResponseCache } from "../utils/cacher.ts"
import { hasher } from "../utils/hasher.ts"

export type HTMLContent = string
export type Render = (ctx: RequestContext) => HTMLContent | Promise<HTMLContent>

export type SSRRoute = { 
  route: string
  srcURL?: URL
  middleware?: Middleware[] | Middleware
  render: Render
  cacheLifetime?: number
}

/**
 * SSR request handler complete with JS app rendering, HTML templating & response caching logic. 
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ctx: RequestContext, ssrData: SSRRoute) => {
  // TODO: emit srcURL file change events from watcher worker

  // use provided render and template fcns for HTML generation
  const HTML = await ssrData.render(ctx)   
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
    srcURL: URL - e.g. new URL("./src/home.js")
    middleware?: Middleware (optional)
    render: Render - e.g. (req, params) => renderToString(app())
    cacheLifetime?: number - e.g. 3600000
 * }
*/
export const addSSRRoute = (ssrData: SSRRoute) => {
  const memoizeHandler = createResponseCache({
    lifetime: ssrData.cacheLifetime
  }) 

  const cachedSSRHandler = memoizeHandler((ctx) => ssrHandler(ctx, ssrData))

  return addRoute({
    route: ssrData.route,
    method: "GET",
    middleware: ssrData.middleware,
    handler: async (ctx) => !config.devMode
      // use cache-enabled fcn if not in prod env and pass in params 
      // so we cache renders by params as well as SSRRoute data
      ? await cachedSSRHandler(ctx)
      : await ssrHandler(ctx, ssrData)
  })
}

// TODO: test angle bracket HTMLContent returned from render