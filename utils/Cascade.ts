import { RequestContext, Handler, Middleware } from "../server.ts"

type ResolvePromise = { 
  resolve: (value: Response | PromiseLike<Response>) => Response | void, 
  reject: (reason?: unknown) => void
}
type Result = void | Response | Error
type SafeMiddleware = (ctx: RequestContext, next: () => Promise<Response>| Response) => Promise<Response | void>

/**
 * Utility class for running middleware functions as a cascade
 */
export class Cascade {
  async forward(ctx: RequestContext, toCall: Array<Middleware | Handler> ): Promise<{ result: Result, toResolve: ResolvePromise[] }> {
    let result: Result
    const toResolve: ResolvePromise[]  = []

    for (const fcn of toCall) {
      try {
        const fcnPromise: SafeMiddleware = fcn.constructor.name === "AsyncFunction"
          ? fcn as SafeMiddleware
          : (ctx, next) => new Promise((res) => {
            const result = fcn(ctx, next)
            res(result)
          })

        result = await this.run(ctx, fcnPromise, toResolve)
      } catch (error) {
        result = error
      }
    }
  
    return { result, toResolve }
  }

  backward(result: Result, toResolve: ResolvePromise[]): Response | void {
    let response: Response | void
    for (let i = toResolve.length-1; i >= 0; i--) {
      response = result instanceof Response 
        ? toResolve[i].resolve(result)
        : toResolve[i].reject(result)
    }
    return response
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
