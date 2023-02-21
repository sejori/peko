import { Server as stdServer } from "https://deno.land/std@0.174.0/http/server.ts"
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
  stdServer: stdServer | undefined
  port = 7777
  hostname = "0.0.0.0"
  middleware: PromiseMiddleware[] = []
  routers: Router[] = [] 
  
  public get allRoutes(): Route[] {
    return [ this, ...this.routers].map(router => router.routes).flat()
  }

  constructor(config?: { 
    port?: number, 
    hostname?: string, 
  }) {
    super()
    if (!config) return
    const { port, hostname } = config
    if (port) this.port = port
    if (hostname) this.hostname = hostname
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
   * Start listening to HTTP requests.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  async listen(port?: number, onListen?: (server: stdServer) => void): Promise<void> {
    if (port) this.port = port
    
    this.stdServer = new stdServer({ 
      port: this.port, 
      handler: (request: Request) => this.requestHandler.call(this, request) 
    })

    if (onListen) {
      onListen(this.stdServer)
    } else {
      console.log(`Peko server started on port ${this.port} with routes:`)
      this.routes.forEach((route, i) => console.log(`${route.method} ${route.path} ${i===this.routes.length-1 ? "\n" : ""}`))
    }

    return await this.stdServer.listenAndServe()
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

  /**
   * Stop listening to HTTP requests.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  close(): void {
    if (this.stdServer) this.stdServer.close()
  }
}

export default Server