import { addRoute, RequestContext, Middleware } from "../server.ts"
import { config } from "../config.ts"
import { createResponseCache } from "../utils/cache.ts"
import { hasher } from "../utils/hash.ts"

export type SSRRoute = { 
  route: string
  srcURL?: URL
  middleware?: Middleware[] | Middleware
  render: Render
  cacheLifetime?: number
}
export type Render = (ctx: RequestContext) => string | Promise<string>

/**
 * SSR request handler complete with JS app rendering, HTML templating & response caching logic. 
 * 
 * @param ctx: RequestContext
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ctx: RequestContext, ssrData: SSRRoute) => {
  // TODO: emit srcURL file change events from watcher worker (in devMode)

  // use provided render and template fcns for HTML generation
  const HTML = await ssrData.render(ctx)   
  const hashString = await hasher(HTML)

  return new Response(HTML, {
    headers : new Headers({
      'Content-Type': 'text/html; charset=utf-8',
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