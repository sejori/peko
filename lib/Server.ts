import { Server as stdServer } from "https://deno.land/std@0.174.0/http/server.ts"
import { Router, _Route } from "./utils/Router.ts"
import { Cascade, PromiseMiddleware } from "./utils/Cascade.ts"
import { Middleware } from "./types.ts"

export class RequestContext {
  url: URL
  _route: _Route | undefined
  state: Record<string, unknown>
  params: Record<string, unknown> = {}

  constructor(
    public server: Server, 
    public request: Request, 
    state?: Record<string, unknown>
  ) {
    this.url = new URL(request.url)
    this.state = state ? state : {}
  }

  get route () {
    return this._route
  }

  set route (r: _Route | undefined) {
    this._route = r;
    if (r?.params) {
      const pathBits = this.url.pathname.split("/")
      for (const param in r.params) {
        this.params[param] = pathBits[r.params[param]]
      }
    }
  }
}

export class Server extends Router {
  stdServer: stdServer | undefined
  port = 7777
  hostname = "127.0.0.1"
  middleware: PromiseMiddleware[] = []
  routers: Router[] = [] 
  
  public get allRoutes(): _Route[] {
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
   * @param onError: error handler
   */
  async listen(
    port?: number,
    onListen?: (server: stdServer) => void,
    onError?: (error: unknown) => Response | Promise<Response>
  ): Promise<void> {
    if (port) this.port = port
    
    this.stdServer = new stdServer({ 
      port: this.port, 
      hostname: this.hostname,
      handler: (request: Request) => this.requestHandler.call(this, request),
      onError
    })

    if (onListen) {
      onListen(this.stdServer)
    } else {
      console.log(`Peko server started on port ${this.port} with routes:`)
      this.allRoutes.forEach((route, i) => console.log(`${route.method} ${route.path} ${i===this.routes.length-1 ? "\n" : ""}`))
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

    ctx.route = this.allRoutes.find(route => 
      route.regexPath.test(ctx.url.pathname) && 
      route.method === request.method
    )

    return await new Cascade(ctx).start()
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
