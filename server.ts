import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
import { Promisify } from "./utils/Promisify.ts"
import { Cascade } from "./utils/Cascade.ts"

export class RequestContext {
  server: Server
  request: Request
  state: Record<string, unknown>

  constructor(server: Server, request?: Request, state?: Record<string, unknown>) {
    this.server = server
    this.request = request 
      ? request
      : new Request("http://localhost")

    this.state = state
      ? state 
      : {}
  }
}

export class Server {
  port = 7777
  hostname = "0.0.0.0"
  logging: (l: unknown) => Promise<unknown> | unknown = (log: unknown) => console.log(log)

  // utility classes for server logic
  #cascade = new Cascade()
  #promisify = new Promisify()

  // route array for request routing
  routes: SafeRoute[] = []

  // middleware array for request handling
  middleware: SafeMiddleware[] = []

  constructor(config?: { 
    port?: number, 
    hostname?: string, 
    logging: (l: unknown) => Promise<unknown> | unknown 
  }) {
    if (!config) return
    const { port, hostname, logging } = config
    if (port) this.port = port
    if (hostname) this.hostname = hostname
    if (logging) this.logging = logging
  }

  /**
   * Add global middleware to all server routes
   * @param middleware: Middleware[] | Middleware 
   * @returns number - server.middleware.length
   */
  use(middleware: Middleware | Middleware[]) {
    if (Array.isArray(middleware)) {
      middleware.forEach(mware => this.use(mware))
      return middleware.length
    }
    return this.middleware.push(this.#promisify.middleware(middleware))
  }

  /**
   * Add Route
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - server.routes.length
   */
  addRoute(route: Route): number {
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
      middleware: m.map(mware => this.#promisify.middleware(mware)),
      handler: this.#promisify.handler(route.handler)
    })
  }

  /**
   * Add Routes
   * @param routes: Route[] - middleware can be Middlewares or Middleware 
   * @returns number - routes.length
   */
  addRoutes(routes: Route[]): number {
    routes.forEach(route => {
      return this.addRoute(route)
    })
    return routes.length
  }

  /**
   * Remove Route from Peko server
   * @param route: string - route id of Route to remove
   * @returns 
   */
  removeRoute(route: string): number {
    const routeToRemove = this.routes.find(r => r.route === route)
    if (!routeToRemove) return this.routes.length

    this.routes.splice(this.routes.indexOf(routeToRemove), 1)
    return this.routes.length
  }

  /**
   * Remove Route from Peko server
   * @param route: string - route id of Route to remove
   * @returns 
   */
  removeRoutes(routes: string[]): number {
    routes.forEach(route => this.removeRoute(route))
    return this.routes.length
  }
  
  /**
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   * @param port: number
   * @param cb: onListen callback function
   */
  listen(port?: number, cb?: (params: { hostname: string; port: number; }) => void): void {
    serve((request) => this.requestHandler.call(this, request), { 
      hostname: this.hostname, 
      port: port ? port : this.port,
      onError: (error) => {
        this.log(error)
        return new Response(null, { status: 500 })
      },
      onListen: cb 
        ? cb 
        : () => {
          this.log(`Peko server started on port ${this.port} with routes:`)
          this.routes.forEach((route, i) => this.log(`${route.method} ${route.route} ${i===this.routes.length-1 ? "\n" : ""}`))
        } 
    })
  }

  async requestHandler(request: Request): Promise<Response> {
    const ctx: RequestContext = new RequestContext(this, request)
    const requestURL = new URL(request.url)
    const route = this.routes.find(route => route.route === requestURL.pathname && route.method === request.method)

    const toCall: SafeMiddleware[] = route 
      ? [ ...this.middleware, ...route.middleware, route.handler ]
      : [ ...this.middleware, async () => await new Response(null, { status: 404 }) ]
    

    try {
      const { response, toResolve } = await this.#cascade.forward(ctx, toCall)
      await this.#cascade.backward(response, toResolve)

      // clone so cached original can be reused
      return response.clone()
    } catch(error) {
      this.log(error)
      return new Response(null, { status: 500 }).clone()
    }
  }

  /**
   * Safe unknown data logging. Uses config.logging wrapped in try catch.
   * @param data: unknown 
   * @returns void
   */
  async log(data: unknown) {
    try {
      return await this.logging(data)
    } catch (error) {
      console.log(data)
      console.log(error)
    }
  }
}

interface SafeRoute {
  route: `/${string}`
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware: SafeMiddleware[],
  handler: SafeHandler
}
export type SafeHandler = (ctx: RequestContext) => Promise<Response>
export type SafeMiddleware = (ctx: RequestContext, next: () => Promise<Response>) => Promise<Response | void>

export interface Route { 
  route: `/${string}`
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware?: Middleware[] | Middleware
  handler: Handler
}
export type Handler = (ctx: RequestContext) => Promise<Response> | Response
export type Middleware = (ctx: RequestContext, next: () => Promise<Response>) => Promise<Response | void> | Response | void

export default Server