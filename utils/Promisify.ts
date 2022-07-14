import { 
  Handler, 
  Middleware, 
  RequestContext,
  SafeHandler,
  SafeMiddleware
} from "../server.ts"

export class Promisify {
  middleware (fcn): (fcn: Middleware) => SafeMiddleware {
    if (fcn.constructor.name === "AsyncFunction") return fcn as SafeMiddleware
    return (ctx: RequestContext, next: () => Promise<Response>) => new Promise((res) => {
      const result = fcn(ctx, next)
      res(result)
    })
  }
  
  handler (fcn): (fcn: Handler) => SafeHandler {
    if (fcn.constructor.name === "AsyncFunction") return fcn as SafeHandler
    return (ctx: RequestContext) => new Promise((res) => {
      const result = fcn(ctx)
      res(result)
    })
  }
}