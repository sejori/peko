import { Server as stdServer } from "https://deno.land/std@0.174.0/http/server.ts"
import { Cascade } from "./utils/Cascade.ts"

export class RequestContext {
  server: Server
  request: Request
  state: Record<string, unknown>

  constructor(server: Server, request: Request, state?: Record<string, unknown>) {
    this.server = server
    this.request = request
    this.state = state
      ? state 
      : {}
  }
}

export interface Route { 
  path: `/${string}`
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware?: Middleware[] | Middleware
  handler: Handler
}

export type Handler = (ctx: RequestContext) => Promise<Response> | Response
export type HandlerOptions = { headers?: Headers }
export type NextMiddleware = () => Promise<Response | void> | Response | void
export type Middleware = (ctx: RequestContext, next: NextMiddleware) => Promise<Response | void> | Response | void
export type PromiseMiddleware = (ctx: RequestContext, next: NextMiddleware) => Promise<Response | void>

export class Server {
  #stdServer: stdServer | undefined
  port = 7777
  hostname = "0.0.0.0"
  middleware: PromiseMiddleware[] = []
  routes: Route[] = []

  constructor(config?: { 
    port?: number, 
    hostname?: string, 
  }) {
    if (!config) return
    const { port, hostname } = config
    if (port) this.port = port
    if (hostname) this.hostname = hostname
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
    return this.middleware.push(Cascade.promisify(middleware))
  }

  /**
   * Add Route
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - server.routes.length
   */
  addRoute(route: Route): number
  addRoute(route: `/${string}`, data: Handler | Partial<Route>): number
  addRoute(route: `/${string}`, middleware: Middleware | Middleware[], handler: Handler): number
  addRoute(
    arg1: Route | `/${string}`, 
    arg2?: Partial<Route> | Middleware | Middleware[], 
    arg3?: Handler
  ): number {
    const routeObj: Partial<Route> = typeof arg1 !== "string"
      ? arg1
      : arguments.length === 2
        ? typeof arg2 === "function"
          ? { path: arg1, handler: arg2 as Handler }
          : { path: arg1, ...arg2 as Partial<Route> }
        : { path: arg1, middleware: arg2 as Middleware | Middleware[], handler: arg3 }
     
    if (!routeObj.path) throw new Error("Missing route path: `/${route}`")
    if (!routeObj.handler) throw new Error("Missing route handler")
    routeObj.method = routeObj.method || "GET"
    routeObj.handler = Cascade.promisify(routeObj.handler!) as Handler

    return this.routes.push({ 
      ...routeObj as Route,
      middleware: [routeObj.middleware]
        .flat()
        .filter(Boolean)
        .map((mware) => Cascade.promisify(mware!)),
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
    const routeToRemove = this.routes.find(r => r.path === route)
    if (!routeToRemove) return this.routes.length

    this.routes.splice(this.routes.indexOf(routeToRemove), 1)
    return this.routes.length
  }

  /**
   * Remove Routes from Peko server
   * @param routes: string[] - route ids of Routes to remove
   * @returns 
   */
  removeRoutes(routes: string[]): number {
    routes.forEach(route => this.removeRoute(route))
    return this.routes.length
  }
  
  /**
   * Start listening to HTTP requests.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  async listen(port?: number, onListen?: (server: stdServer) => void): Promise<void> {
    if (port) this.port = port
    
    this.#stdServer = new stdServer({ 
      port: this.port, 
      handler: (request: Request) => this.requestHandler.call(this, request) 
    })

    if (onListen) {
      onListen(this.#stdServer)
    } else {
      console.log(`Peko server started on port ${this.port} with routes:`)
      this.routes.forEach((route, i) => console.log(`${route.method} ${route.path} ${i===this.routes.length-1 ? "\n" : ""}`))
    }

    return await this.#stdServer.listenAndServe()
  }

  /**
   * Generate Response by running route middleware/handler with Cascade.
   * @param request: Request
   * @returns Promise<Response>
   */
  async requestHandler(request: Request): Promise<Response> {
    const ctx: RequestContext = new RequestContext(this, request)
    const requestURL = new URL(ctx.request.url)

    const route = this.routes.find(route => 
      route.path === requestURL.pathname && 
      route.method === request.method
    )
    
    return await new Cascade(ctx, route).start()
  }

  /**
   * Stop listening to HTTP requests.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  close(): void {
    if (this.#stdServer) this.#stdServer.close()
  }
}

export default Server