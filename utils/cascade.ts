import { MiddlewareResult, RequestContext, SafeMiddleware } from "../server.ts"

export class Cascade {
  async forward (ctx: RequestContext, toCall: SafeMiddleware[]) {
    let result: MiddlewareResult
    let called = 0
  
    const toResolve: { 
      resolve: (value: Response | PromiseLike<Response>) => void, 
      reject: (reason?: unknown) => void
    }[] = []
  
    while (!(result instanceof Response)) {
      result = await run(ctx, toCall[called], toResolve)
      called += called < toCall.length-1 ? 1 : 0
    }
  
    const response: Response = result
  
    return { response, toResolve }
  }

  resolve (
    response: Response,
    toResolve: { 
      resolve: (value: Response | PromiseLike<Response>) => void, 
      reject: (reason?: unknown) => void; 
    }[]
  ) {
    for (let i = toResolve.length-1; i >= 0; i--) {
      toResolve[i].resolve(response)
    }
  }
  
  // quite a funky Promise-based middleware executor
  run (ctx, fcn, toResolve): (
    ctx: RequestContext,
    fcn: SafeMiddleware, 
    toResolve: { 
      resolve: (value: Response | PromiseLike<Response>) => void, 
      reject: (reason?: unknown) => void; 
    }[]
  ) => Promise<Response | void> {
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
          ctx.server.logError(ctx.request.url, e, new Date())
          resolve(await ctx.server.handleError(ctx, 500))
        })
    })
  }
}