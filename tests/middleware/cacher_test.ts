import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { cacher } from "../../middleware/cacher.ts"
import { testHandler } from "../../tests/mock.ts"
import { ResponseCache } from "../../utils/ResponseCache.ts"

Deno.test("MIDDLEWARE: Cacher", async (t) => {
  const successString = "Success!"
  const CACHE_LIFETIME = 100
  const cache = new ResponseCache({
    lifetime: CACHE_LIFETIME
  })
  const server = new Server()
  const memHandler = cacher(cache)

  const testData = {
    foo: "bar"
  }
  
  await t.step("Response created and cached as expected", async () => {
    const ctx = new RequestContext(server, new Request("http://localhost"), { ...testData })
    const response1 = await cacher(cache)(ctx, () => new Response(successString))
    assert(!ctx.state.responseFromCache && ctx.state.foo === testData.foo)

    const response2 = await cacher(cache)(ctx, () => new Response(successString))
    assert(ctx.state.responseFromCache === true && ctx.state.foo === testData.foo)
    
    const body1 = await response1?.text()
    const body2 = await response2?.text()
    assert(body1 === successString && body2 === successString)
  }) 

  await t.step("Cached response invalidated as expected", async () => {
    await new Promise(res => setTimeout(res, CACHE_LIFETIME))
    const ctx = new RequestContext(server, new Request("http://localhost"), { ...testData })
    const response = await cacher(cache)(ctx, async () => await new Response(successString))
    const body = await response?.text()

    assert(!ctx.state.responseFromCache && ctx.state.foo === testData.foo)
    assert(body === successString)
  })

  await t.step("memoize - preserve handler logic", async () => {
    const ctx = new RequestContext(server, new Request("http://localhost"), { thing: "different" })
    const testRes = await testHandler(ctx)
    const memRes = await memHandler(ctx, () => testHandler(ctx))
    assert(memRes)

    const testJSON = await testRes.json()
    const memJSON2 = await memRes.json()

    assert(testJSON.foo === memJSON2.foo)
  })

  await t.step("return 304 with matching ETAG", async () => {
    const ETag = "1234567890"
    
    // consider testing for correct key generation as logic is set to include path + params
    const ctx = new RequestContext(server, new Request("http://localhost/static-content?test-thing=hello", {
      headers: new Headers({ "if-none-match": ETag })
    }))

    const memRes = await memHandler(ctx, () => new Response("hello", {
      headers: new Headers({ "ETag": ETag })
    }))
    const memRes2 = await memHandler(ctx, () => new Response("hello", {
      headers: new Headers({ "ETag": ETag })
    }))

    assert(memRes && memRes.status === 200)
    assert(memRes2 && memRes2.status === 304)
  })
})