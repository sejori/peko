import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { encode, decode } from "https://deno.land/std@0.174.0/encoding/base64.ts"
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("UTIL: Crypto", async (t) => {
  const hmacCrypto = new Crypto("SUPER_SECRET_KEY_123")

  const generatedKeyPair: CryptoKeyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-512',
    },
    true,
    ['sign', 'verify']
  );
  const rsaPrivateCrypto = new Crypto(generatedKeyPair.privateKey, { name: "RSA", hash: "SHA-512" })
  const rsaPublicCrypto = new Crypto(generatedKeyPair.publicKey, { name: "RSA", hash: "SHA-512" })

  const rsaPrivateCrypto_fromCert = new Crypto(await Deno.readTextFile(new URL("../mocks/crypto_rsa_private.key", import.meta.url)), { name: "RSA", hash: "SHA-256" })
  const rsaPublicCrypto_fromCert = new Crypto(await Deno.readTextFile(new URL("../mocks/crypto_rsa_public_key.crt", import.meta.url)), { name: "RSA", hash: "SHA-256" })
  
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
    const hmac_hash1 = await hmacCrypto.hash(str)
    const hmac_hash2 = await hmacCrypto.hash(str)
    const rsa_hash1 = await rsaPrivateCrypto.hash(str)
    const rsa_hash2 = await rsaPrivateCrypto.hash(str)

    assert(hmac_hash1 === hmac_hash2)
    assert(rsa_hash1 === rsa_hash2)
  }) 

  await t.step("HMAC sign creates valid jwt", async () => {
    hmac_token = await hmacCrypto.sign(inputPayload)

    const [ hmac_b64Header, hmac_b64Payload, hmac_b64Signature ] = hmac_token.split('.')
    assert(hmac_token.split('.').length === 3)
    assert(hmac_b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(hmac_b64Header))
    assert(decode(hmac_b64Signature))
  })

  await t.step("HMAC verify return valid jwt payload", async () => {
    const hmac_payload = await hmacCrypto.verify(hmac_token)
    assert(JSON.stringify(hmac_payload) == JSON.stringify(inputPayload))
  })

  await t.step("RSA sign creates valid jwt from CryptoKeyPair", async () => {
    rsa_token = await rsaPrivateCrypto.sign(inputPayload)

    const [ rsa_b64Header, rsa_b64Payload, rsa_b64Signature ] = rsa_token.split('.')
    assert(rsa_token.split('.').length === 3)
    assert(rsa_b64Payload === encode(JSON.stringify(inputPayload)))
    assert(decode(rsa_b64Header))
    assert(decode(rsa_b64Signature))
  })

  await t.step("RSA verify return valid jwt payload from CryptoKeyPair", async () => {
    const rsa_payload = await rsaPublicCrypto.verify(rsa_token)
    assert(JSON.stringify(rsa_payload) == JSON.stringify(inputPayload))
  })

  await t.step("RSA sign creates valid jwt from key/cert files", async () => {
    rsa_token_cert = await rsaPrivateCrypto_fromCert.sign(inputPayload)

    const [ rsa_b64Header_cert, rsa_b64Payload_cert, rsa_b64Signature_cert ] = rsa_token_cert.split('.')
    assert(rsa_token_cert.split('.').length === 3)
    assert(rsa_b64Payload_cert === encode(JSON.stringify(inputPayload)))
    assert(decode(rsa_b64Header_cert))
    assert(decode(rsa_b64Signature_cert))
  })

  await t.step("RSA verify return valid jwt payload from key/cert files", async () => {
    const rsa_from_cert_payload = await rsaPublicCrypto_fromCert.verify(rsa_token_cert)
    assert(JSON.stringify(rsa_from_cert_payload) == JSON.stringify(inputPayload))
  })
})