import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { logRequest, logError } from "./utils/log.ts"
import { config } from "./config.ts"

const routes: SafeRoute[] = []

interface SafeRoute extends Route {
  middleware: Middleware[]
}

export interface Route { 
  route: string
  method?: string
  middleware?: Middleware[] | Middleware
  handler: Handler
}

export type MiddlewareResult = Promise<Response | void> | Response | void
export type Middleware = (ctx: RequestContext, next: () => MiddlewareResult) => MiddlewareResult
export type Handler = (ctx: RequestContext) => Promise<Response> | Response

export class RequestContext {
  request: Request
  status: number
  data: Record<string, unknown>

  constructor(request: Request) {
    this.request = request
    this.status = 200
    this.data = {}
  }
}

/**
 * Respond to http requests with config and routes.
 */
export const start = () => {
  config.logString(`Peko server ${config.devMode ? "(devMode)" : ""} started with routes:`)
  routes.forEach((route, i) => config.logString(`${route.method} ${route.route} ${i===routes.length-1 ? "\n" : ""}`))
  
  serve(requestHandler, { 
    hostname: config.hostname, 
    port: config.port 
  })
}

const requestHandler = async (request: Request) => {
  const ctx: RequestContext = new RequestContext(request)
  // const start = Date.now()

  // locate matching route
  const requestURL = new URL(request.url)
  const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)
  
  if (!route) {
    // logRequest(ctx, 404, start, Date.now() - start)
    ctx.status = 404
    return tryHandleError(ctx)
  }

  const toCall = [ ...route.middleware, route.handler ]
  let called = 0
  
  let result: MiddlewareResult

  const run: (m: Middleware) => MiddlewareResult = (fcn: Middleware) => {
    // this code is confusing but I'm trying to resolve the run promise on next call
    // so that the request handling can continue to the next mware on next()
    // and we don't need to wait for every mware to resolve before returning response
    return new Promise((resolve, reject) => {
      called += called < toCall.length-1 ? 1 : 0
      const next = async () => {
        resolve()
        await run(toCall[called])
      }

      try {
        const x = fcn.call(ctx, ctx, next)

        if (x instanceof Promise) {
          x.then((res) => {
            result = res
            resolve()
          })
        } else {
          result = x
          resolve()
        }
      } catch (error) {
        logError(request.url, error, new Date())
        // logRequest(ctx, 500, start, Date.now() - start)
        ctx.status = 500
        tryHandleError(ctx)
        reject()
      }
    })
  }

  while (!(result instanceof Response)) await run(toCall[called])
  // logRequest(ctx, result.status, start, Date.now() - start)
  return result 
}

const tryHandleError = async (ctx: RequestContext) => {
  try {
    return await config.handleError(ctx)
  } catch (error) {
    console.log(error)
    return new Response("Error:", error)
  }
}

/**
 * Add Route to Peko server 
 * @param route: Route - middleware can be Middlewares or Middleware 
 * @returns number - routes.length
 */
export const addRoute = (route: Route) => {
  const m: Middleware[] = []
  const none = () => {}

  if (!route.method) route.method = "GET"

  // consolidate singular or null middleware to Middleware[]
  if (route.middleware) {
    if (route.middleware instanceof Array) {
      route.middleware.forEach(middle => m.push(middle))
    } else {
      m.push(route.middleware)
    }
  } else m.push(none)

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