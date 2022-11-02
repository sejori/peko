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
  config: Config = {
    port: 7777,
    hostname: "0.0.0.0",
    globalMiddleware: [],
    logging: (log: unknown) => console.log(log),
  }

  constructor(config?: Partial<Config>) {
    if (config) this.setConfig(config)
  }

  // utility classes for server logic
  #cascade = new Cascade()
  #promisify = new Promisify()

  // route array for request routing
  routes: SafeRoute[] = []

  /**
   * Update config with partial config object
   * @param newConf: Partial<Config>
   * @returns void
   */
  setConfig (newConf: Partial<Config>): void {
    for (const key in newConf) {
      Object.defineProperty(this.config, key, {
        value: newConf[key as keyof typeof this.config]
      })
    }
  }

  /**
   * Add Route
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - routes.length
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
    return routes.map(route => {
      return this.addRoute(route)
    }).reduce((a, b) => a + b)
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
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   * @param port: number
   * @param cb: onListen callback function
   */
  listen(port?: number, cb?: (params: { hostname: string; port: number; }) => void): void {
    serve((request) => this.requestHandler.call(this, request), { 
      hostname: this.config.hostname, 
      port: port ? port : this.config.port,
      onError: (error) => {
        this.log(error)
        return new Response(null, { status: 500 })
      },
      onListen: cb 
        ? cb 
        : () => {
          this.log(`Peko server started on port ${this.config.port} with routes:`)
          this.routes.forEach((route, i) => this.log(`${route.method} ${route.route} ${i===this.routes.length-1 ? "\n" : ""}`))
        } 
    })
  }

  async requestHandler(request: Request): Promise<Response> {
    const ctx: RequestContext = new RequestContext(this, request)
    const requestURL = new URL(request.url)
    const route = this.routes.find(route => route.route === requestURL.pathname && route.method === request.method)

    const toCall: SafeMiddleware[] = route 
      ? [ ...this.config.globalMiddleware, ...route.middleware, route.handler ]
      : [ ...this.config.globalMiddleware, async () => await new Response(null, { status: 404 }) ]
    

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
  async log(data: unknown): Promise<void> {
    try {
      return await this.config.logging(data)
    } catch (error) {
      console.log(data)
      console.log(error)
    }
  }
}

export interface Config { 
  port: number
  hostname: string
  globalMiddleware: SafeMiddleware[]
  logging: (data: unknown) => Promise<void> | void
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