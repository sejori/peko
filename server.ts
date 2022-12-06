import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
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
  route: `/${string}`
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware?: Middleware[] | Middleware
  handler: Handler
}

export type Handler = (ctx: RequestContext) => Promise<Response> | Response
export type HandlerOptions = { headers?: Headers }
export type Middleware = (ctx: RequestContext, next: () => Promise<Response | void> | Response | void) => Promise<Response | void> | Response | void

export class Server {
  port = 7777
  hostname = "0.0.0.0"
  middleware: Middleware[] = []
  routes: Route[] = []
  #cascade = new Cascade()

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
    return this.middleware.push(middleware)
  }

  /**
   * Add Route
   * @param route: Route - middleware can be Middlewares or Middleware 
   * @returns number - server.routes.length
   */
  // method overloading
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
          ? { route: arg1, handler: arg2 as Handler }
          : { route: arg1, ...arg2 as Partial<Route> }
        : { route: arg1, middleware: arg2 as Middleware | Middleware[], handler: arg3 }
     
    if (!routeObj.route) throw new Error("Missing route path: `/${route}`")
    if (!routeObj.handler) throw new Error("Missing route handler")
    routeObj.method = routeObj.method || "GET"

    return this.routes.push({ 
      ...routeObj as Route,
      middleware: [routeObj.middleware]
        .flat()
        .filter(Boolean)
        .map((mware) => mware as Middleware),
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
   * Remove Routes from Peko server
   * @param routes: string[] - route ids of Routes to remove
   * @returns 
   */
  removeRoutes(routes: string[]): number {
    routes.forEach(route => this.removeRoute(route))
    return this.routes.length
  }
  
  /**
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  listen(
    port?: number, 
    onListen?: (params: { hostname: string; port: number; }) => void,
    onError?: (error: unknown) => Promise<Response> | Response
  ): void {
    serve((request) => this.requestHandler.call(this, request), { 
      hostname: this.hostname, 
      port: port ? port : this.port,
      onError: onError
        ? onError
        : (error) => {
          return new Response(String(error), { status: 500 })
        },
      onListen: onListen 
        ? onListen 
        : () => {
          console.log(`Peko server started on port ${this.port} with routes:`)
          this.routes.forEach((route, i) => console.log(`${route.method} ${route.route} ${i===this.routes.length-1 ? "\n" : ""}`))
        } 
    })
  }

  /**
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   * @param request: Request
   * @returns Promise<Response>
   */
  async requestHandler(request: Request): Promise<Response> {
    const ctx: RequestContext = new RequestContext(this, request)
    const requestURL = new URL(ctx.request.url)

    const route = this.routes.find(route => 
      route.route === requestURL.pathname && 
      route.method === request.method
    )

    const toCall: Middleware[] = route
      ? [...this.middleware, ...route.middleware as Middleware[], route.handler]
      : [...this.middleware]
    
    const { result: forward_result, toResolve } = await this.#cascade.forward(ctx, toCall)
    const backward_result = this.#cascade.backward(forward_result, toResolve)

    if (forward_result instanceof Response) {
      return forward_result
    } else if (backward_result) {
      return backward_result
    } else {
      return new Response()
    }
  }
}

export default Server