import { RequestContext, SafeMiddleware } from "../server.ts"

type ResolvePromise = { 
  resolve: (value: Response | PromiseLike<Response>) => void, 
  reject: (reason?: unknown) => void
}

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  async forward(ctx: RequestContext, toCall: SafeMiddleware[]): Promise<{ response: Response, toResolve: ResolvePromise[] }> {
    let result: Response | void
    let called = 0
  
    const toResolve: ResolvePromise[]  = []
  
    while (!(result instanceof Response)) {
      try {
        result = await this.run(ctx, toCall[called], toResolve)
        called += called < toCall.length-1 ? 1 : 0
      } catch (e) {
        result = new Response(null, { status: 500 }).clone()
        ctx.server.log(e)
      }
    }
  
    const response: Response = result
  
    return { response, toResolve }
  }

  backward(response: Response, toResolve: ResolvePromise[]): Promise<void> {
    return new Promise(res => {
      for (let i = toResolve.length-1; i >= 0; i--) {
        toResolve[i].resolve(response)
      }
      res()
    })
  }
  
  // quite a funky Promise-based middleware executor
  run(ctx: RequestContext, fcn: SafeMiddleware, toResolve: ResolvePromise[]): Promise<Response | void> {
    return new Promise((resolve, reject) => {
      // resolve current Promise to move onto next middleware
      // will resolve with eventual server response
      const next = () => {
        resolve()
        const callerPromise: Promise<Response> = new Promise((resolve, reject) => toResolve.push({ resolve, reject }))
        return callerPromise
      }
  
      fcn(ctx, next)
        .then((result: Response | void) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
