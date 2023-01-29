import { Middleware, NextMiddleware, PromiseMiddleware, RequestContext } from "../server.ts"

export const mergeHeaders = (base: Headers, source: Headers) => {
  for (const pair of source) {
    base.set(pair[0], pair[1])
  }

  return base
}

export const promisify = (fcn: Middleware): PromiseMiddleware => {
  return fcn.constructor.name === "AsyncFunction"
    ? fcn as PromiseMiddleware
    : (ctx: RequestContext, next: NextMiddleware) => new Promise((res, rej) => {
      try { res(fcn(ctx, next)) } catch(e) { rej(e) }
    })
}
