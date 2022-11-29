import { SafeMiddleware, RequestContext } from "../server.ts"

export const testMiddleware1: SafeMiddleware = async (ctx, next) => {
  const start = Date.now()
  ctx.state.middleware1 = { start }
  await new Promise(res => setTimeout(res, 1))
  const res = await next()
  const end = Date.now()
  ctx.state.middleware1 = { start, end, res }
}

export const testMiddleware2: SafeMiddleware = async (ctx, next) => {
  const start = Date.now()
  ctx.state.middleware2 = { start }
  await new Promise(res => setTimeout(res, 1))
  const res = await next()
  const end = Date.now()
  ctx.state.middleware2 = { start, end, res }
}

export const testMiddleware3: SafeMiddleware = async (ctx, next) => {
  const start = Date.now()
  ctx.state.middleware3 = { start }
  await new Promise(res => setTimeout(res, 1))
  const res = await next()
  const end = Date.now()
  ctx.state.middleware3 = { start, end, res }
}

export const testHandler = async (ctx: RequestContext) => {
  return await new Response(JSON.stringify({ ...ctx.state, createdAt: Date.now() }))
}