import { assert } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { PekoServer, RequestContext } from "../../server.ts"
import { testHandler } from "../../tests/mock_data.ts"
import { ResponseCache } from "../ResponseCache.ts"

Deno.test("UTIL: CACHE", async (t) => {
  const testServer = new PekoServer()
  const testContext = new RequestContext(testServer, undefined, { foo: "bar" })

  const CACHE_LIFETIME = 200
  const cache = new ResponseCache({ lifetime: CACHE_LIFETIME })
  const key = "test", value = new Response()
  const memHandler = cache.memoize(testHandler)

  await t.step("create cache", () => {
    assert(cache instanceof ResponseCache)
    assert(!cache.items[0])
  })

  await t.step("update cache", () => {
    const result = cache.set(key, value)
    assert(result.key === key)
    assert(result.value === value)
    assert(result.dob == Date.now() || result.dob < Date.now())
  })

  await t.step("retrieve from cache", () => {
    const result = cache.get(key)
    assert(result)
    assert(result.key === key)
    assert(result.value === value)
    assert(result.dob < Date.now())
  })

  await t.step("memoize - preserve handler logic", async () => {
    const testRes = await testHandler(testContext)
    const memRes = await memHandler(testContext)
    const testJSON = await testRes.json()
    const memJSON2 = await memRes.json()

    assert(testJSON.foo === memJSON2.foo)
  })

  await t.step("memoize - return previous response", async () => {
    // use new contexts as prev have been modified with responseFromCache property
    const testContext = new RequestContext(testServer, undefined, { foo: "bar" })
    const testContext2 = new RequestContext(testServer, undefined, { foo: "bar" })

    const memRes = await memHandler(testContext)
    const memRes2 = await memHandler(testContext2)
    const resJSON = await memRes.json()
    const resJSON2 = await memRes2.json()
    assert(resJSON.createdAt === resJSON2.createdAt)
  })

  await t.step("memoize - invalidates item after lifetime", async () => {
    const memRes = await memHandler(testContext)
    await new Promise(res => setTimeout(res, CACHE_LIFETIME))

    const memRes2 = await memHandler(testContext)
    const resJSON = await memRes.json()
    const resJSON2 = await memRes2.json()
    assert(resJSON.createdAt !== resJSON2.createdAt)
  })
})