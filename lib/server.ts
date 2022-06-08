import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { Route, HandlerParams } from "./types.ts"
import { getConfig } from "./config.ts"
import { logRequest, logError } from "./utils/logger.ts"

export const routes: Route[] = []

/**
 * Add a Route to your Peko server.
 * 
 * See "lib/types.ts" for Middleware, Handler & HandlerParams type details
 * 
 * Note: "handlerParams" argument of Middleware and Handler is used to pass data from middleware logic to handler logic.
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
 * Begin listening to http requests and serve matching routes.
 * 
 * See "lib/types.ts" for Config type details.
 * 
 * Note: Config changes will not take effect after start is called. 
 */
 export const start = () => {
  const config = getConfig()
  config.logString(`Starting Peko server on port ${config.port} in ${config.devMode ? "development" : "production"} mode with routes:`)
  routes.forEach(route => config.logString(JSON.stringify(route)))

  serve(requestHandler, { 
    hostname: config.hostname, 
    port: config.port 
  })
}

const requestHandler = async (request: Request) => {
  const start = Date.now()
  const config = getConfig()

  // locate matching route
  const requestURL = new URL(request.url)
  const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)
  if (!route) {
    logRequest(request, 404, start, Date.now() - start)
    return await config.errorHandler(404, request)
  }
  
  // run middleware function first if provided
  const mwParams = {}
  if (route.middleware) {
    try {
      await route.middleware(request, mwParams)
    } catch (error) {
      logError(request.url, error, new Date())
      logRequest(request, 500, start, Date.now() - start)
      return await config.errorHandler(500, request)
    }
  }

  // run handler function
  let response
  try {
    response = await route.handler(request, mwParams)
  } catch(error) {
    logError(request.url, error, new Date())
    logRequest(request, 500, start, Date.now() - start)
    return await config.errorHandler(500, request)
  }

  logRequest(request, response.status, start, Date.now() - start)
  return response
}