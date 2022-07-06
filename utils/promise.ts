import { 
  Handler, 
  Middleware, 
  RequestContext,
  SafeHandler,
  SafeMiddleware
} from "../server.ts"

export const promisifyMiddleware: (fcn: Middleware) => SafeMiddleware = (fcn) => {
  if (fcn.constructor.name === "AsyncFunction") return fcn as SafeMiddleware
  return (ctx: RequestContext, next: () => Promise<Response>) => new Promise((res) => {
    const result = fcn(ctx, next)
    res(result)
  })
}

export const promisifyHandler: (fcn: Handler) => SafeHandler = (fcn) => {
  if (fcn.constructor.name === "AsyncFunction") return fcn as SafeHandler
  return (ctx: RequestContext) => new Promise((res) => {
    const result = fcn(ctx)
    res(result)
  })
}