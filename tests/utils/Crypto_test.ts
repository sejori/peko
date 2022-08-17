import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { encode, decode } from "https://deno.land/std@0.150.0/encoding/base64url.ts";
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("UTIL: Crypto", async (t) => {
  const crypto = new Crypto("SUPER_SECRET_KEY_123")
  const str = "test-string-1234567890"

  const inputPayload = { 
    iat: Date.now(), 
    exp: Date.now() + 250, 
    data: { test: str } 
  }
  let token: string
  
  await t.step("hash creates repeatable hash", async () => {
    const hash1 = await crypto.hash(str)
    const hash2 = await crypto.hash(str)

    assert(hash1 === hash2)
  }) 

  await t.step("sign creates valid jwt", async () => {
    token = await crypto.sign(inputPayload)

    const [ b64Header, b64Payload, b64Signature ] = token.split('.')
    // valiate that boi
    assert(token.split('.').length === 3)
    assert(b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(b64Header))
    assert(decode(b64Signature))
  })

  await t.step("verify return valid jwt payload", async () => {
    const payload = await crypto.verify(token)

    assert(JSON.stringify(payload) == JSON.stringify(inputPayload))
  })

  await t.step("verify fails if token expires", async () => {
    await new Promise(res => setTimeout(res, 250))

    assert(await crypto.verify(token) === undefined)
  })
})