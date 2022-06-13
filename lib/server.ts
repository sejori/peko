import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { config } from "./config.ts"
import { logRequest, logError } from "./utils/logger.ts"

/**
 * Begin listening and responding to http requests with user config and routes.
 */
 export const start = () => {
  config.logString(`Starting Peko server on port ${config.port} in ${config.devMode ? "development" : "production"} mode with routes:`)
  routes.forEach(route => config.logString(JSON.stringify(route)))

  serve(requestHandler, { 
    hostname: config.hostname, 
    port: config.port 
  })
}

export type RequestContext = Record<string, Request | Response | number | string | boolean>
const requestHandler = async (request: Request) => {
  const ctx: RequestContext = { request }
  const start = Date.now()

  // locate matching route
  const requestURL = new URL(request.url)
  const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)
  if (!route) {
    logRequest(ctx, 404, start, Date.now() - start)
    return tryHandleError(ctx, 404)
  }
  
  // run middleware stack and handler function
  const callerArray = [...route.middleware, route.handler]
  for (const fcn in callerArray) {
    try {
      const response = await callerArray[fcn].call(ctx, ctx)
      logRequest(ctx, 200, start, Date.now() - start)
      if (response) return response
    } catch (error) {
      logError(request.url, error, new Date())
      logRequest(ctx, 500, start, Date.now() - start)
    }
  }

  return tryHandleError(ctx, 500)
}

const tryHandleError = async (ctx: RequestContext, code?: number, error?: string) => {
  try {
    return await config.errorHandler(ctx, code, error)
  } catch (e) {
    console.log(e)
    return new Response("Something went very wrong...")
  }
}

export type MiddlewareFcn = (ctx: RequestContext) => Promise<Response | void> | Response | void
export type Middleware = MiddlewareFcn[]
export type Handler = (ctx: RequestContext) => Promise<Response> | Response
export type Route = { 
  route: string
  method: string
  middleware: Middleware
  handler: Handler
}
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
export const addRoute = (routeData: Route) => {
  const middleware: MiddlewareFcn[] = []

  // users can supply array of middleware fcns or single fcn
  if (routeData.middleware) {
    if (routeData.middleware instanceof Array) {
      routeData.middleware.forEach(mWare => middleware.push(mWare))
    } else {
      middleware.push(routeData.middleware)
    }
  } else middleware.push(() => {})

  return routes.push({ 
    ...routeData,
    middleware
  })
}

/**
 * Remove a Route from your Peko server
 * 
 * @param route: `/${string}` - path route of Route to be removed
 * @returns 
 */
export const removeRoute = (route: string) => {
  const routeToRemove = routes.find(r => r.route === route)
  if (routeToRemove) return routes.splice(routes.indexOf(routeToRemove), 1).length
}

  // TODO: test route strings for formatting to enforce type `/${string}` in devMode
  // TODO: test middleware and handlers for cookie and rendering bear traps