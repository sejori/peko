import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { Promisify } from "../../utils/Promisify.ts"

Deno.test("UTIL: PROMISIFY", async (t) => {
  const server = new Server()
  const ctx = new RequestContext(server)

  const promisify = new Promisify()
  const mWare = (ctx: RequestContext, next: () => Promise<Response>) => {
    ctx.state = { foo: 'bar' }
    return next()
  }
  const handler = (ctx: RequestContext) => {
    return new Response(JSON.stringify(ctx.state))
  }

  const safeMWare = promisify.middleware(mWare)
  const safeHandler = promisify.handler(handler)
  
  await t.step("middleware and handler converted to promises", async () => {
    await safeMWare(ctx, () => safeHandler(ctx))
    assert(ctx.state.foo === "bar")
  }) 
})