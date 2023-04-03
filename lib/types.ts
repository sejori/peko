import { RequestContext } from "./server.ts"

export interface Route { 
  path: `/${string}`
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware?: Middleware[] | Middleware
  handler: Handler
}

export type Result = void | Response
export type Next = () => Promise<Result> | Result

export type Middleware = (ctx: RequestContext, next: Next) => Promise<Result> | Result
export type Handler = (ctx: RequestContext) => Promise<Response> | Response
export type HandlerOptions = { headers?: Headers }