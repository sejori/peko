// import { crypto } from "https://deno.land/std@0.150.0/crypto/mod.ts"
import { encode as encodeB64, decode as decodeB64 } from "https://deno.land/std@0.150.0/encoding/base64url.ts"
const encoder = new TextEncoder()

/**
 * Crypto class, generates hashes and signs and verifies JWTs using CyptoKey (generated from string or provided).
 * @param key: CryptoKey | string
 */
export class Crypto {
  key: CryptoKey | string

  constructor(key: CryptoKey | string) {
    this.key = key
  }

  /**
   * Create CryptoKey from rawKey string to be used in crypto methods
   */
  static async createCryptoKey(rawKey: string): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      "raw",
      encoder.encode(rawKey),
      { name: "HMAC", hash: "SHA-256"}, // only supported algorithm in Deno crypto API?
      false, //extractable
      ["sign", "verify"]
    )
  }

  /**
   * Generate hash from string
   * @param contents: string
   * @returns hashHex: string
   */
  async hash(contents: string): Promise<string> {
    if (!(this.key instanceof CryptoKey)) this.key = await Crypto.createCryptoKey(this.key)

    // TODO: may need to give users more fine-grained control of doigest algorithmm
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(contents))
    return encodeB64(hashBuffer)
  }

  /**
   * Sign (create) JWT from payload
   * @param payload: Record<string, unknown>
   * @returns jwt: Promise<string>
   */
  async sign (payload: Record<string, unknown>): Promise<string> {
    if (!(this.key instanceof CryptoKey)) this.key = await Crypto.createCryptoKey(this.key)

    // TODO: can I hard code this to RS256?
    const b64Header = encodeB64(JSON.stringify({
      alg: "RS256",
      typ: "JWT"
    }))
    const b64Payload = encodeB64(JSON.stringify(payload))

    const signatureBuffer = await crypto.subtle.sign(
      this.key.algorithm, 
      this.key, 
      encoder.encode(`${b64Header}.${b64Payload}`)
    )
    const signature = encodeB64(signatureBuffer)

    return `${b64Header}.${b64Payload}.${signature}`
  }

  /**
   * Verify JWT and extract payload
   * @param jwt: string
   * @returns payload: Promise<Record<string, unknown> | false>
   */
  async verify (jwt: string): Promise<Record<string, unknown> | false> {
    if (!(this.key instanceof CryptoKey)) this.key = await Crypto.createCryptoKey(this.key)

    const split = jwt.split(".")
    if (split.length != 3) return false
    const [ b64Header, b64Payload, b64Signature ] = split

    const verified = await crypto.subtle.verify(
      this.key.algorithm, 
      this.key, 
      decodeB64(b64Signature),
      encoder.encode(`${b64Header}.${b64Payload}`)
    )

    return verified
      ? JSON.parse(atob(b64Payload))
      : false
  }
}