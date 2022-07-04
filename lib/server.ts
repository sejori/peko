import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { logError } from "./utils/log.ts"
import { logger } from "./middlewares/logger.ts"

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

export class Peko {
  config = {
    devMode: false,
    port: 7777,
    hostname: "0.0.0.0",
    globalMiddleware: [
      logger
    ],
    logString: (log: string) => console.log(log),
    logEvent: (e: Event) => console.log(e),
    handleError: (ctx: RequestContext) => {
      let response;
      switch (ctx.state.status) {
        case 401: 
        response = new Response("401: Unauthorized!", {
          headers: new Headers(),
          status: 401
        })
        break
        case 404: 
          response = new Response("404: Nothing found here!", {
            headers: new Headers(),
            status: 404
          })
          break
        default:
          response = new Response("500: Internal Server Error!", {
            headers: new Headers(),
            status: 500
          })
          break
      }
      return response;
    }
  }

  setConfig = (newConfObj: Partial<Peko["config"]>) => {
    for (const key in newConfObj) {
      Object.defineProperty(this.config, key, {
        value: newConfObj[key as keyof typeof this.config]
      })
    }
  }

  routes: SafeRoute[] = []

  /**
   * Add Route to Peko server 
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - routes.length
   */
  addRoute = (route: Route) => {
    const method = route.method ? route.method : "GET"
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
  
    return this.routes.push({ 
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
  removeRoute = (route: string) => {
    const routeToRemove = this.routes.find(r => r.route === route)
    if (!routeToRemove) return this.routes.length
  
    this.routes.splice(this.routes.indexOf(routeToRemove), 1)
    return this.routes.length
  }
  
  /**
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   */
  start = () => {
    this.config.logString(`Peko server ${this.config.devMode ? "(devMode)" : ""} started with routes:`)
    this.routes.forEach((route, i) => this.config.logString(`${route.method} ${route.route} ${i===this.routes.length-1 ? "\n" : ""}`))
    
    serve(this.#requestHandler, { 
      hostname: this.config.hostname, 
      port: this.config.port 
    })
  }

  #requestHandler = async (request: Request) => {
    const ctx: RequestContext = new RequestContext(request)
    const requestURL = new URL(request.url)
    const route = this.routes.find(route => route.route === requestURL.pathname && route.method === request.method)
  
    let toCall: Middleware[] = [ ...this.config.globalMiddleware, this.#tryHandleError ]
    if (route) {
      ctx.state.status = 200
      toCall = [ ...this.config.globalMiddleware, ...route.middleware, route.handler ]
    }
  
    const response = await this.#runMiddleware(ctx, toCall)
    return response
  }
  
  #runMiddleware = async (ctx: RequestContext, toCall: Middleware[]) => {
    let called = 0
    let result: MiddlewareResult
  
    // quite a funky Promise-based recursive middleware executor
    const run: (m: Middleware) => MiddlewareResult = (fcn: Middleware) => {
      return new Promise((resolve, reject) => {
        // track how many middleware we've called to know which is next across stack frames
        called += called < toCall.length-1 ? 1 : 0
  
        // passed into middleware to resolve current Promise to move onto next middleware
        // will resolve when next middleware resolves (by returning or calling next)
        const next = async () => {
          resolve()
          await run(toCall[called])
        }
    
        try {
          console.log("calling ", fcn)
          const mResult = fcn.call(ctx, ctx, next)
          if (mResult instanceof Promise) {
            mResult.then((res) => {
              result = res
              resolve()
            })
          } else {
            result = mResult
            resolve()
          }
        } catch (error) {
          logError(ctx.request.url, error, new Date())
          ctx.state.status = 500
          this.#tryHandleError(ctx)
          reject()
        }
      })
    }
  
    while (!(result instanceof Response)) await run(toCall[called])
    return result 
  }
  
  #tryHandleError: Handler = async (ctx: RequestContext) => {
    try {
      return await this.config.handleError(ctx)
    } catch (error) {
      console.log(error)
      return new Response("Error:", error)
    }
  }
}

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

export type Middleware = (ctx: RequestContext, next: () => MiddlewareResult) => MiddlewareResult
export type MiddlewareResult = Promise<Response | void> | Response | void
export type Handler = (ctx: RequestContext) => Promise<Response> | Response

// TODO: test route strings for formatting to enforce type `/${string}` in devMode
// TODO: test middleware and handlers for cookie and rendering bear traps

// /**
//  * LEGACY Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
//  */
// export const start = () => {
//   config.logString(`Peko server ${config.devMode ? "(devMode)" : ""} started with routes:`)
//   routes.forEach((route, i) => config.logString(`${route.method} ${route.route} ${i===routes.length-1 ? "\n" : ""}`))
  
//   serve(requestHandler, { 
//     hostname: config.hostname, 
//     port: config.port 
//   })
// }