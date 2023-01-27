import { assert } from "std/testing/asserts.ts"
import { encode, decode } from "std/encoding/base64.ts"
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("UTIL: Crypto", async (t) => {
  const hmac_crypto = new Crypto({ name: "HMAC", hash: "SHA-256" }, "SUPER_SECRET_KEY_123")
  const rsa_crypto = new Crypto({ name: "RSA", hash: "SHA-256" }, await Deno.readTextFile(new URL("./mock_key.pem", import.meta.url)))
  
  const str = "test-string-1234567890"

  const inputPayload = { 
    iat: Date.now(), 
    exp: Date.now() + 250, 
    data: { test: str } 
  }
  let hmac_token: string
  let rsa_token: string
  
  await t.step("hash creates repeatable hash", async () => {
    const hmac_hash1 = await hmac_crypto.hash(str)
    const hmac_hash2 = await hmac_crypto.hash(str)
    const rsa_hash1 = await rsa_crypto.hash(str)
    const rsa_hash2 = await rsa_crypto.hash(str)

    assert(hmac_hash1 === hmac_hash2)
    assert(rsa_hash1 === rsa_hash2)
  }) 

  await t.step("sign creates valid jwt", async () => {
    hmac_token = await hmac_crypto.sign(inputPayload)
    rsa_token = await rsa_crypto.sign(inputPayload)

    const [ hmac_b64Header, hmac_b64Payload, hmac_b64Signature ] = hmac_token.split('.')
    assert(hmac_token.split('.').length === 3)
    assert(hmac_b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(hmac_b64Header))
    assert(decode(hmac_b64Signature))

    const [ rsa_b64Header, rsa_b64Payload, rsa_b64Signature ] = rsa_token.split('.')
    assert(rsa_token.split('.').length === 3)
    assert(rsa_b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(rsa_b64Header))
    assert(decode(rsa_b64Signature))
  })

  await t.step("verify return valid jwt payload", async () => {
    const hmac_payload = await hmac_crypto.verify(hmac_token)
    const rsa_payload = await rsa_crypto.verify(rsa_token)

    assert(JSON.stringify(hmac_payload) == JSON.stringify(inputPayload))
    assert(JSON.stringify(rsa_payload) == JSON.stringify(inputPayload))
  })
})