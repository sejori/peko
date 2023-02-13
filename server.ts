import { Server as stdServer } from "https://deno.land/std@0.174.0/http/server.ts"
import { Router } from "./Router.ts"
import { Cascade } from "./utils/Cascade.ts"
import { Middleware, PromiseMiddleware, RequestContext } from "./types.ts"

export class Server {
  stdServer: stdServer | undefined
  port = 7777
  hostname = "0.0.0.0"
  middleware: PromiseMiddleware[] = []
  routers: Router[] = [new Router()] 
  public get routes() {
    return this.routers.map(router => router.routes).flat()
  }

  constructor(config?: { 
    port?: number, 
    hostname?: string, 
  }) {
    if (!config) return
    const { port, hostname } = config
    if (port) this.port = port
    if (hostname) this.hostname = hostname
  }

  // basic Router API on default router
  addRoute = this.routers[0].addRoute
  removeRoute = this.routers[0].removeRoute
  addRoutes: Router["addRoutes"] = (...args) => this.routers[0].addRoutes(args[0])
  removeRoutes: Router["removeRoutes"] = (...args) => this.routers[0].removeRoutes(args[0])

  addRouter (router: Router) {
    return this.routers.push(router)
  }

  removeRouter (router: Router) {
    return this.routers = this.routers.filter(existing => existing !== router)
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
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  async listen(port?: number, onListen?: (address: Deno.Addr[]) => void): Promise<void> {
    if (port) this.port = port
    this.stdServer = new stdServer({ 
      port: this.port, 
      handler: (request: Request) => this.requestHandler.call(this, request) 
    })

    if (onListen) {
      onListen(this.stdServer.addrs)
    } else {
      console.log(`Peko server started on port ${this.port} with routes:`)
      this.routes.forEach((route, i) => console.log(`${route.method} ${route.path} ${i===this.routes.length-1 ? "\n" : ""}`))
    }

    await this.stdServer.listenAndServe()
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
      route.path === requestURL.pathname && 
      route.method === request.method
    )

    const toCall: PromiseMiddleware[] = route
      ? [...this.middleware, ...route.middleware as PromiseMiddleware[], route.handler as PromiseMiddleware]
      : [...this.middleware]
    
    const result = await new Cascade(ctx, toCall).start()

    if (result instanceof Response) {
      return result
    } else {
      return new Response("", { status: 404 })
    }
  }

  /**
   * Start listening to HTTP requests. Peko's requestHandler provides routing, cascading middleware & error handling.
   * @param port: number
   * @param onListen: onListen callback function
   * @param onError: onListen callback function
   */
  close(): void {
    if (this.stdServer) this.stdServer.close()
  }
}

export default Server