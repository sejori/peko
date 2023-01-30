import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { ResponseCache } from "../../utils/ResponseCache.ts"

Deno.test("UTIL: Response cache", async (t) => {
  const CACHE_LIFETIME = 200
  const cache = new ResponseCache({ lifetime: CACHE_LIFETIME })
  const key = "test", value = new Response()

  await t.step("create cache", () => {
    assert(cache instanceof ResponseCache)
    assert(!cache.items[0])
  })

  await t.step("update cache", async () => {
    const result = await cache.set(key, value)
    assert(result.key === key)
    assert(result.value === value)
    assert(result.dob == Date.now() || result.dob < Date.now())
  })

  await t.step("retrieve from cache", () => {
    const result = cache.get(key)
    assert(result)
    assert(result?.key === key)
    assert(result?.value === value)
    assert(result?.dob && result?.dob < Date.now())
  })

  await t.step("invalidates item after lifetime", async () => {
    cache.set(key, value)
    await new Promise(res => setTimeout(res, CACHE_LIFETIME))
    const result = cache.get(key)

    assert(result === undefined)
  })

  // TODO: init cache items test
})