import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { logger } from "./middlewares/logger.ts"

export class RequestContext {
  peko: PekoServer
  request: Request
  state: Record<string, unknown>

  constructor(peko: PekoServer, request?: Request) {
    this.peko = peko
    this.request = request 
      ? request
      : new Request("http://localhost")
    this.state = {
      status: 404
    }
  }
}

export class PekoServer {
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
      let response
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

  setConfig = (newConfObj: Partial<PekoServer["config"]>) => {
    for (const key in newConfObj) {
      Object.defineProperty(this.config, key, {
        value: newConfObj[key as keyof typeof this.config]
      })
    }
  }

  /**
   * Peko's internal request logging function. Uses this.config.logString and this.config.logEvent.
   * Returns promise so process isn't blocked when called without "await" keyword.
   * @param ctx: RequestContext
   * @param start: number
   * @param responseTime: number
   * @returns Promise<void>
   */
  async logRequest(ctx: RequestContext, start: number, responseTime: number) {
    const date = new Date(start)
    const status = ctx.state.status
    const cached = ctx.state.cached
    const request: Request | undefined = ctx.request
    const requestEvent: Event = {
      id: `${ctx.request?.method}-${request?.url}-${date.toJSON()}`,
      type: "request",
      date: date,
      data: {
        status,
        responseTime: `${responseTime}ms`,
        request: request,
        ctx
      }
    }

    try {
      await this.config.logString(`[${requestEvent.date}] ${status} ${request?.method} ${request?.url} ${requestEvent.data.responseTime}${cached ? " (CACHED)" : ""}`)
    } catch (error) {
      console.log(error)
    }

    try {
      await this.config.logEvent(requestEvent)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Peko's internal error logging function. Uses this.config.logEvent
   * Returns Promise so process isn't blocked when called without "await" keyword.
   * @param id: string
   * @param error: any
   * @param date: Date
   * @returns Promise<void>
   */
  async logError(id: string, error: string, date: Date) {
    try {
      return await this.config.logEvent({ id: `ERROR-${id}-${date.toJSON()}`, type: "error", date: date, data: { error } })
    } catch (e) {
      return console.error(e)
    }
  }

  routes: SafeRoute[] = []

  /**
   * Add Route to Peko server 
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - routes.length
   */
  addRoute(route: Route) {
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
  removeRoute(route: string) {
    const routeToRemove = this.routes.find(r => r.route === route)
    if (!routeToRemove) return this.routes.length
  
    this.routes.splice(this.routes.indexOf(routeToRemove), 1)
    return this.routes.length
  }
  
  /**
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   */
  listen(port?: number, cb?: (params: { hostname: string; port: number; }) => void) {
    this.config.logString(`Peko server ${this.config.devMode ? "(devMode)" : ""} started with routes:`)
    this.routes.forEach((route, i) => this.config.logString(`${route.method} ${route.route} ${i===this.routes.length-1 ? "\n" : ""}`))
    
    serve(this.#requestHandler, { 
      hostname: this.config.hostname, 
      port: port ? port : this.config.port,
      onError: (error) => {
        try {
          if (error) this.logError(`${error}`, `${error}`, new Date())
        } catch(e) {
          console.log(e)
          console.log(error)
        }

        const ctx = new RequestContext(this)
        ctx.state.status = 500
        return this.#tryHandleError(ctx)
      },
      onListen: cb ? cb : () => {}
    })
  }

  async #requestHandler(request: Request) {
    const ctx: RequestContext = new RequestContext(this, request)
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
  
  async #runMiddleware (ctx: RequestContext, toCall: Middleware[]) {
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
          reject()
          throw(error)
          // this.logError(ctx.request.url, error, new Date())
          // ctx.state.status = 500
          // this.#tryHandleError(ctx)
        }
      })
    }
  
    while (!(result instanceof Response)) await run(toCall[called])
    return result 
  }
  
  async #tryHandleError(ctx: RequestContext) {
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

export type Event = {
  id: string
  type: "request" | "emit" | "error"
  date: Date
  data: Record<string, unknown>
}

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