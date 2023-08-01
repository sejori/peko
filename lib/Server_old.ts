import { Server as stdServer } from "https://deno.land/std@0.174.0/http/server.ts"
import { Router, _Route } from "./Router.ts"
import { Cascade } from "./utils/Cascade.ts"
import { Middleware } from "./types.ts"

export class RequestContext {
  url: URL
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
}

export class Server extends Router {
  stdServer: stdServer | undefined
  port = 7777
  hostname = "127.0.0.1"

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
  use(middleware: Middleware | Middleware[]) {
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
      console.log(`Peko HTTP server running on port ${this.port}`)
    }

    return await this.stdServer.listenAndServe()
  }

  /**
   * Generate Response by running route middleware/handler with Cascade.
   * @param request: Request
   * @returns Promise<Response>
   */
  async requestHandler(request: Request): Promise<Response> {
    const ctx = new RequestContext(this, request)
    return await new Cascade(ctx, this.middleware).run()
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
