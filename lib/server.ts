import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { logRequest, logError } from "./utils/logger.ts"
import { config } from "./config.ts"

const routes: SafeRoute[] = []

interface SafeRoute extends Route {
  middleware: Middleware[]
}

export interface Route { 
  route: string
  method: string
  middleware?: Middleware[] | Middleware
  handler: Handler
}

export type Middleware = (ctx: RequestContext) => Promise<Response | void> | Response | void
export type Handler = (ctx: RequestContext) => Promise<Response> | Response

export class RequestContext {
  request: Request
  data: Record<string, Response | number | string | boolean>

  constructor(request: Request) {
    this.request = request
    this.data = {}
  }
}

/**
 * Respond to http requests with config and routes.
 */
export const start = () => {
  config.logString(`Starting Peko server ${config.devMode ? "in devMode" : ""} on port ${config.port} with routes:`)
  routes.forEach(route => config.logString(JSON.stringify({ ...route })))

  serve(requestHandler, { 
    hostname: config.hostname, 
    port: config.port 
  })
}

const requestHandler = async (request: Request) => {
  const ctx: RequestContext = new RequestContext(request)
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
      if (response instanceof Response) return response
    } catch (error) {
      logError(request.url, error, new Date())
      logRequest(ctx, 500, start, Date.now() - start)
    }
  }

  return tryHandleError(ctx, 500)
}

const tryHandleError = async (ctx: RequestContext, code?: number, error?: string) => {
  try {
    return await config.handleError(ctx, code, error)
  } catch (e) {
    console.log(e)
    return new Response("Configured errorHandler ...")
  }
}

/**
 * Add Route to Peko server 
 * @param route: Route - middleware can be Middlewares or Middleware 
 * @returns number - routes.length
 */
export const addRoute = (route: Route) => {
  const m: Middleware[] = []

  // consolidate singular or null middleware to Middleware[]
  if (route.middleware) {
    if (route.middleware instanceof Array) {
      route.middleware.forEach(middle => m.push(middle))
    } else {
      m.push(route.middleware)
    }
  } else m.push(() => {})

  return routes.push({ 
    ...route,
    middleware: m
  })
}

/**
 * Remove Route from Peko server
 * @param route: string - route id of Route to remove
 * @returns 
 */
export const removeRoute = (route: string) => {
  const routeToRemove = routes.find(r => r.route === route)
  if (!routeToRemove) return routes.length

  routes.splice(routes.indexOf(routeToRemove), 1)
  return routes.length
}

// TODO: test route strings for formatting to enforce type `/${string}` in devMode
// TODO: test middleware and handlers for cookie and rendering bear traps