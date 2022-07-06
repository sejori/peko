import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { logger } from "./middlewares/logger.ts"
import { promisifyMiddleware, promisifyHandler } from "./utils/promise.ts"
import { run, cascadeResolve } from "./utils/cascade.ts"

export class RequestContext {
  peko: PekoServer
  request: Request
  state: Record<string, unknown> = {}

  constructor(peko: PekoServer, request?: Request) {
    this.peko = peko
    this.request = request 
      ? request
      : new Request("http://localhost")
  }
}

export default class PekoServer {
  config: Config = {
    devMode: false,
    port: 7777,
    hostname: "0.0.0.0",
    globalMiddleware: [
      logger
    ],
    stringLogger: (log: string) => console.log(log),
    eventLogger: (e: Event) => console.log(e),
    errorHandler: (_ctx: RequestContext, status: number) => {
      let response
      switch (status) {
        case 400: 
          response = new Response("400: Bad request", {
            headers: new Headers(),
            status: 400
          })
          break
        case 401: 
          response = new Response("401: Unauthorized", {
            headers: new Headers(),
            status: 401
          })
          break
        case 404: 
          response = new Response("404: Nothing found here", {
            headers: new Headers(),
            status: 404
          })
          break
        default:
          response = new Response("500: Internal Server Error", {
            headers: new Headers(),
            status: 500
          })
          break
      }
      return response;
    }
  }

  setConfig = (newConfObj: Partial<Config>) => {
    for (const key in newConfObj) {
      Object.defineProperty(this.config, key, {
        value: newConfObj[key as keyof typeof this.config]
      })
    }
  }

  routes: SafeRoute[] = []

  /**
   * Add Route
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - routes.length
   */
  addRoute(route: Route) {
    const method = route.method ? route.method : "GET"
    const m: Middleware[] = []
    function none() {}
  
    if (!route.method) route.method = "GET"
  
    // consolidate singular or null middleware to Middleware[]
    if (route.middleware) {
      if (route.middleware instanceof Array) {
        route.middleware.forEach(middle => m.push(middle))
      } else {
        m.push(route.middleware)
      }
    } else m.push(none)

    // ensure middleware and handler return promises for requestHandler
    return this.routes.push({ 
      ...route,
      method,
      middleware: m.map(mware => promisifyMiddleware(mware)),
      handler: promisifyHandler(route.handler)
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
   * @param port: number
   * @param cb: callback function
   */
  listen(port?: number, cb?: (params: { hostname: string; port: number; }) => void) {
    this.logString(`Peko server ${this.config.devMode ? "(devMode)" : ""} started with routes:`)
    this.routes.forEach((route, i) => this.logString(`${route.method} ${route.route} ${i===this.routes.length-1 ? "\n" : ""}`))

    serve((request) => this.#requestHandler.call(this, request), { 
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
        return this.handleError(ctx, 500)
      },
      onListen: cb ? cb : () => {}
    })
  }

  async #requestHandler(request: Request) {
    const ctx: RequestContext = new RequestContext(this, request)
    const requestURL = new URL(request.url)
    const route = this.routes.find(route => route.route === requestURL.pathname && route.method === request.method)

    const toCall: SafeMiddleware[] = route 
      ? [ ...this.config.globalMiddleware, ...route.middleware, route.handler ]
      : [ ...this.config.globalMiddleware, (ctx) => this.handleError(ctx, 404) ]
  
    const response = await this.#cascadeMiddleware(ctx, toCall)
    return response
  }

  async #cascadeMiddleware (ctx: RequestContext, toCall: SafeMiddleware[]) {
    let result: MiddlewareResult
    let called = 0

    const toResolve: { 
      resolve: (value: Response | PromiseLike<Response>) => void, 
      reject: (reason?: unknown) => void; 
    }[] = []
  
    while (!(result instanceof Response)) {
      result = await run(ctx, toCall[called], toResolve)
      called += called < toCall.length-1 ? 1 : 0
    }

    // called without await to not block process
    cascadeResolve(toResolve, result)

    return result 
  }
  
  /**
   * Safe error handler. Uses config.handleError wrapped in try catch.
   * @param ctx 
   * @param status 
   * @returns Response
   */
  async handleError(ctx: RequestContext, status: number) {
    try {
      return await this.config.errorHandler(ctx, status)
    } catch (error) {
      console.log(error)
      return new Response("Error:", error)
    }
  }

  /**
   * Safe string logger. Uses config.stringLogger wrapped in try catch.
   * @param string: string
   * @returns void
   */
  async logString(string: string) {
    try {
      return await this.config.stringLogger(string)
    } catch (error) {
      console.log(string)
      console.log(error)
    }
  }

   /**
   * Safe string logger. Uses config.stringLogger wrapped in try catch.
   * @param event: Event 
   * @returns void
   */
     async logEvent(event: Event) {
      try {
        return await this.config.eventLogger(event)
      } catch (error) {
        console.log(event)
        console.log(error)
      }
    }

  /**
   * Uses Peko.config.logString and Peko.config.logEvent. Returns promise to not block process
   * @param ctx: RequestContext
   * @param start: number
   * @param responseTime: number
   * @returns Promise<void>
   */
    async logRequest(ctx: RequestContext, response: Response, start: number, responseTime: number) {
    const date = new Date(start)
    const status = response.status
    const cached = ctx.state.cached
    const request: Request | undefined = ctx.request
    const requestEvent: Event = {
      id: `${ctx.request?.method}-${request?.url}-${date.toJSON()}`,
      type: "request",
      date: date,
      data: {
        ctx,
        response,
        responseTime: `${responseTime}ms`,
        request,
        status,
      }
    }

    try {
      await this.logString(`[${requestEvent.date}] ${status} ${request?.method} ${request?.url} ${requestEvent.data.responseTime}${cached ? " (CACHED)" : ""}`)
    } catch (error) {
      console.log(error)
    }

    try {
      await this.logEvent(requestEvent)
    } catch (error) {
      console.log(error)
    }
  }
  
  /**
   * Uses this.config.logEvent. Returns promise to not block process
   * @param id: string
   * @param error: any
   * @param date: Date
   * @returns Promise<void>
   */
  async logError(id: string, error: string, date: Date) {
    try {
      return await this.logEvent({ id: `ERROR-${id}-${date.toJSON()}`, type: "error", date: date, data: { error } })
    } catch (e) {
      return console.error(e)
    }
  }
}

export interface Config { 
  devMode: boolean
  port: number
  hostname: string
  globalMiddleware: SafeMiddleware[]
  stringLogger: (log: string) => Promise<void> | void
  eventLogger: (data: Event) => Promise<void> | void
  errorHandler: (ctx: RequestContext, statusCode: number) => Response | Promise<Response>
}

interface SafeRoute {
  route: string,
  method: string,
  middleware: SafeMiddleware[],
  handler: SafeHandler
}

export type SafeMiddleware = (ctx: RequestContext, next: () => Promise<Response>) => Promise<Response | void>
export type SafeHandler = (ctx: RequestContext) => Promise<Response>

export interface Route { 
  route: string
  method?: string
  middleware?: Middleware[] | Middleware
  handler: Handler
}

export type Middleware = (ctx: RequestContext, next: () => Promise<Response>) => MiddlewareResult
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