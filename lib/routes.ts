import { routes } from "./server.ts"
import { Route, StaticRoute, SSRRoute, SSERoute } from "./types.ts"
import { getConfig } from "./config.ts"

import { createResponseCache } from "./utils/cacher.ts"
import { staticHandler } from "./handlers/static.ts"
import { ssrHandler } from "./handlers/ssr.ts"
import { sseHandler } from "./handlers/sse.ts"

/**
 * Add a Route to your Peko server.
 * 
 * See "lib/types.ts" for Middleware, Handler & HandlerParams type details
 * 
 * Note: "handlerParams" argument of Middleware and Handler used to pass data from middleware logic to handler logic.
 * 
 * @param routeData { 
    route: string - e.g. "/"
    method: string - e.g. "GET"
    middleware?: Middleware (optional) - e.g. (_request, handlerParams) => handlerParams["time_of_request"] = Date.now()
    handler: Handler - e.g. (_request, handlerParams) => new Response(`${handlerParams["time_of_request"]}`)
 * }
 */
export const addRoute = (routeData: Route) => routes.push(routeData)



/**
 * Remove a Route from your Peko server
 * 
 * @param route: `/${string}` - path route of Route to be removed
 * @returns 
 */
export const removeRoute = (route: `/${string}`) => {
  const routeToRemove = routes.find(r => r.route === route)
  if (routeToRemove) return routes.splice(routes.indexOf(routeToRemove), 1).length
}

/**
 * Add a StaticRoute
 * 
 * Uses staticHandler from /lib/handlers/static.ts
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

/**
 * Add an SSRRoute
 * 
 * Uses ssrHandler from /lib/handlers/ssr.ts
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

/**
 * Add an SSERoute
 * 
 * Uses sseHandler from /lib/handlers/sse.ts
 * 
 * @param sseRouteData { 
      route: string - e.g. "favicon.png"
      emitter: Emitter - Peko's internal event subscription interface
  * }
  */
export const addSSERoute = (sseRouteData: SSERoute) => {
  return addRoute({
    route: sseRouteData.route,
    method: "GET",
    handler: async (request, _params) => await sseHandler(sseRouteData, request)
  })
}