import { assert } from "std/testing/asserts.ts"
import { encode, decode } from "std/encoding/base64.ts"
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("UTIL: Crypto", async (t) => {
  const hmac_crypto = new Crypto({ name: "HMAC", hash: "SHA-256" }, "SUPER_SECRET_KEY_123")

  const generatedKeyPair: CryptoKeyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
  const rsa_private_crypto = new Crypto({ name: "RSA", hash: "SHA-256" }, generatedKeyPair.privateKey)
  const rsa_public_crypto = new Crypto({ name: "RSA", hash: "SHA-256" }, generatedKeyPair.publicKey)

  const rsa_private_crypto_from_cert = new Crypto({ name: "RSA", hash: "SHA-256" }, await Deno.readTextFile(new URL("./pkcs8.key", import.meta.url)))
  const rsa_public_crypto_from_cert = new Crypto({ name: "RSA", hash: "SHA-256" }, await Deno.readTextFile(new URL("./publickey.crt", import.meta.url)))
  
  const str = "test-string-1234567890"

  const inputPayload = { 
    iat: Date.now(), 
    exp: Date.now() + 250, 
    data: { test: str } 
  }
  let hmac_token: string
  let rsa_token: string
  let rsa_token_cert: string
  
  await t.step("hash creates repeatable hash", async () => {
    const hmac_hash1 = await hmac_crypto.hash(str)
    const hmac_hash2 = await hmac_crypto.hash(str)
    const rsa_hash1 = await rsa_private_crypto.hash(str)
    const rsa_hash2 = await rsa_private_crypto.hash(str)

    assert(hmac_hash1 === hmac_hash2)
    assert(rsa_hash1 === rsa_hash2)
  }) 

  await t.step("HMAC sign creates valid jwt", async () => {
    hmac_token = await hmac_crypto.sign(inputPayload)

    const [ hmac_b64Header, hmac_b64Payload, hmac_b64Signature ] = hmac_token.split('.')
    assert(hmac_token.split('.').length === 3)
    assert(hmac_b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(hmac_b64Header))
    assert(decode(hmac_b64Signature))
  })

  await t.step("HMAC verify return valid jwt payload", async () => {
    const hmac_payload = await hmac_crypto.verify(hmac_token)
    assert(JSON.stringify(hmac_payload) == JSON.stringify(inputPayload))
  })

  await t.step("RSA sign creates valid jwt from CryptoKeyPair", async () => {
    rsa_token = await rsa_private_crypto.sign(inputPayload)

    const [ rsa_b64Header, rsa_b64Payload, rsa_b64Signature ] = rsa_token.split('.')
    assert(rsa_token.split('.').length === 3)
    assert(rsa_b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(rsa_b64Header))
    assert(decode(rsa_b64Signature))
  })

  await t.step("RSA verify return valid jwt payload from CryptoKeyPair", async () => {
    const rsa_payload = await rsa_public_crypto.verify(rsa_token)
    assert(JSON.stringify(rsa_payload) == JSON.stringify(inputPayload))
  })

  await t.step("RSA sign creates valid jwt from key/cert files", async () => {
    rsa_token_cert = await rsa_private_crypto_from_cert.sign(inputPayload)

    const [ rsa_b64Header_cert, rsa_b64Payload_cert, rsa_b64Signature_cert ] = rsa_token_cert.split('.')
    assert(rsa_token.split('.').length === 3)
    assert(rsa_b64Payload_cert === encode(JSON.stringify(inputPayload)))
    assert(decode(rsa_b64Header_cert))
    assert(decode(rsa_b64Signature_cert))
  })

  await t.step("RSA verify return valid jwt payload from key/cert files", async () => {
    const rsa_from_cert_payload = await rsa_public_crypto_from_cert.verify(rsa_token)
    console.log(rsa_from_cert_payload)
    assert(JSON.stringify(rsa_from_cert_payload) == JSON.stringify(inputPayload))
  })
})