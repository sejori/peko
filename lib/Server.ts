import { Router } from "./utils/Router.ts"
import { Cascade, PromiseMiddleware } from "./utils/Cascade.ts"
import { Middleware, Route } from "./types.ts"

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

export class Server extends Router {
  middleware: PromiseMiddleware[] = []
  routers: Router[] = [] 
  
  public get allRoutes(): Route[] {
    return [ this, ...this.routers].map(router => router.routes).flat()
  }

  constructor(routes?: Route[]) {
    super()
    if (routes) this.addRoutes(routes)
  }

  /**
   * Add global middleware or another router
   * @param middleware: Middleware[] | Middleware | Router
   * @returns number - server.middleware.length
   */
  use(middleware: Middleware | Middleware[] | Router) {
    if (middleware instanceof Router) {
      return this.routers.push(middleware)
    }

    if (Array.isArray(middleware)) {
      middleware.forEach(mware => this.use(mware))
      return middleware.length
    }
    return this.middleware.push(Cascade.promisify(middleware))
  }

  /**
   * Generate Response by running route middleware/handler with Cascade.
   * @param request: Request
   * @returns Promise<Response>
   */
  async requestHandler(request: Request): Promise<Response> {
    const ctx: RequestContext = new RequestContext(this, request)
    const requestURL = new URL(ctx.request.url)

    const route = this.allRoutes.find(route => 
      route.path === requestURL.pathname && 
      route.method === request.method
    )
    
    return await new Cascade(ctx, route).start()
  }
}
