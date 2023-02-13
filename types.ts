import { Server } from "./Server.ts"

export interface Route { 
  path: `/${string}`
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware?: Middleware[] | Middleware
  handler: Handler
}

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

export type Result = void | Response
export type Next = () => Promise<Result> | Result
export type Middleware = (ctx: RequestContext, next: Next) => Promise<Result> | Result
export type Handler = (ctx: RequestContext) => Promise<Response> | Response
export type HandlerOptions = { headers?: Headers }
export type PromiseMiddleware = (ctx: RequestContext, next: Next) => Promise<Result>