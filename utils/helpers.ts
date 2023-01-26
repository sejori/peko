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

// export const keyToDigest = (key: CryptoKey) => {
//   console.log(key)
//   // if (key.hash) return key.hash
//   // this just needs to return SHA-256, SHA-384 or SHA-512 depending on key 
//   return 
// }

// export const keyToJWTHeader = (key: CryptoKey) => {
//   console.log(key)
// }

