import { assert } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { hasher } from "../hash.ts"

Deno.test("UTIL: HASH", async (t) => {
  const str = "test-string-1234567890"
  
  await t.step("test creates repeating hash", async () => {
    const hash1 = await hasher(str)
    const hash2 = await hasher(str)

    assert(hash1 === hash2)
  })
})