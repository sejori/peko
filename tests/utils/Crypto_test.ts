import { assert } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("UTIL: CRYPTO", async (t) => {
  const crypto = new Crypto("SUPER_SECRET_KEY_123")
  const str = "test-string-1234567890"

  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  const payload = { 
    iat: Date.now(), 
    exp: date.valueOf(), 
    data: { test: str } 
  }
  
  await t.step("hash creates repeatable hash", async () => {
    const hash1 = await crypto.hash(str)
    const hash2 = await crypto.hash(str)

    assert(hash1 === hash2)
  }) 


  // test encodes payload

  // test decodes payload

  // test successfully invalidates
  await t.step("sign creates valid jwt", async () => {
    const token = await crypto.sign(payload)

    console.log(token)

    assert(token)
  })
})