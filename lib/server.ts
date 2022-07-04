import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { logError } from "./utils/log.ts"
import { config } from "./config.ts"

const routes: SafeRoute[] = []

interface SafeRoute extends Route {
  middleware: Middleware[]
  method: string
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
  state: Record<string, unknown>

  constructor(request: Request) {
    this.request = request
    this.state = {
      status: 404
    }
  }
}

/**
 * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
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
  const requestURL = new URL(request.url)
  const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)

  let called = 0
  let result: MiddlewareResult
  let toCall: Middleware[] = [ ...config.globalMiddleware, tryHandleError ]
  if (route) {
    ctx.state.status = 200
    toCall = [ ...config.globalMiddleware, ...route.middleware, route.handler ]
  }

  const run: (m: Middleware) => MiddlewareResult = (fcn: Middleware) => {
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
        ctx.state.status = 500
        tryHandleError(ctx)
        reject()
      }
    })
  }

  while (!(result instanceof Response)) await run(toCall[called])
  return result 
}

const tryHandleError: Handler = async (ctx: RequestContext) => {
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
  const method = route.method ? route.method : "GET"
  const m: Middleware[] = []
  const none = () => {}

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
    method,
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