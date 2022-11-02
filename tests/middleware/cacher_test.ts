import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { cacher } from "../../middleware/cacher.ts"
import { ResponseCache } from "../../utils/ResponseCache.ts"

Deno.test("MIDDLEWARE: Cacher", async (t) => {
  const successString = "Success!"
  const CACHE_LIFETIME = 100
  const cache = new ResponseCache({
    lifetime: CACHE_LIFETIME
  })
  const server = new Server({ logger: () => {} })

  const testData = {
    foo: "bar"
  }
  
  await t.step("Response created and cached as expected", async () => {
    const ctx = new RequestContext(server, undefined, { ...testData })
    const response1 = await cacher(cache)(ctx, async () => await new Response(successString))
    assert(!ctx.state.responseFromCache && ctx.state.foo === testData.foo)

    const response2 = await cacher(cache)(ctx, async () => await new Response(successString))
    assert(ctx.state.responseFromCache === true && ctx.state.foo === testData.foo)
    
    const body1 = await response1?.text()
    const body2 = await response2?.text()
    assert(body1 === successString && body2 === successString)
  }) 

  await t.step("Cached response invalidated as expected", async () => {
    await new Promise(res => setTimeout(res, CACHE_LIFETIME))
    const ctx = new RequestContext(server, undefined, { ...testData })
    const response = await cacher(cache)(ctx, async () => await new Response(successString))
    const body = await response?.text()

    assert(!ctx.state.responseFromCache && ctx.state.foo === testData.foo)
    assert(body === successString)
  }) 
})