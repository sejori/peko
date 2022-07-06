import { MiddlewareResult, RequestContext, SafeMiddleware } from "../server.ts"

// quite a funky Promise-based middleware executor
export const run: (
  ctx: RequestContext,
  fcn: SafeMiddleware, 
  toResolve: { 
    resolve: (value: Response | PromiseLike<Response>) => void, 
    reject: (reason?: unknown) => void; 
  }[]
) => Promise<Response | void> = (ctx, fcn, toResolve) => {
  return new Promise((resolve) => {
    // resolve current Promise to move onto next middleware
    // will resolve with eventual server response
    const next = () => {
      resolve()
      const callerPromise: Promise<Response> = new Promise((resolve, reject) => toResolve.push({ resolve, reject }))
      return callerPromise
    }

    fcn(ctx, next)
      .then((result: MiddlewareResult) => {
        resolve(result)
      })
      .catch(async e => {
        ctx.peko.logError(ctx.request.url, e, new Date())
        resolve(await ctx.peko.handleError(ctx, 500))
      })
  })
}

export const cascadeResolve = (
  toResolve: { 
    resolve: (value: Response | PromiseLike<Response>) => void, 
    reject: (reason?: unknown) => void; 
  }[], 
  result: Response
) => {
  for (let i = toResolve.length-1; i >= 0; i--) {
    toResolve[i].resolve(result)
  }
}