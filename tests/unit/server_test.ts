import { PekoServer, RequestContext, SafeMiddleware, SafeHandler } from "../../server.ts"

export const server = new PekoServer()

export const testMiddleware1: SafeMiddleware = async (ctx, next) => {
  const start = Date.now()
  const res = await next()
  const end = Date.now()
  ctx.state.middleware1 = { start, end, res }
}

export const testMiddleware2: SafeMiddleware = async (ctx, next) => {
  const start = Date.now()
  const res = await next()
  const end = Date.now()
  ctx.state.middleware2 = { start, end, res }
}

export const testMiddleware3: SafeMiddleware = async (ctx, next) => {
  const start = Date.now()
  const res = await next()
  const end = Date.now()
  ctx.state.middleware3 = { start, end, res }
}

export const testHandler: SafeHandler = async (ctx) => {
  return await new Response(JSON.stringify({ ...ctx.state, createdAt: Date.now() }))
}

// CREATE SERVER INSTANCE

// test routes added

// test routes removed

// test global middlewares run

// test config updates

// test all public methods
