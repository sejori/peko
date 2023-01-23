import { crypto } from "https://deno.land/std@0.150.0/crypto/mod.ts"
import { encode as encodeB64, decode as decodeB64 } from "https://deno.land/std@0.150.0/encoding/base64url.ts"
const encoder = new TextEncoder()

/**
 * Crypto class, generates hashes and signs and verifies JWTs using provided key.
 * @param key: CryptoKey | string
 */
export class Crypto {
  key: CryptoKey | undefined

  constructor(key: CryptoKey | string) {
    if (key instanceof CryptoKey) this.key = key
    else Crypto.createCryptoKey(key)
      .then(result => this.key = result)
  }

  /**
   * Create CryptoKey from rawKey string to be used in crypto methods
   */
  static async createCryptoKey(rawKey: string): Promise<CryptoKey> {
    console.log(rawKey)
    console.log(encoder.encode(rawKey))
    console.log(encoder.encode(rawKey).buffer.slice(0, 32))
    return await crypto.subtle.importKey(
      "raw",
      encoder.encode(rawKey).buffer.slice(0, 32),
      { name: "HMAC", hash: "SHA-256"},
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
    if (!this.key) throw new Error("No valid crypto key.")

    // TODO: need to work out why crypto key length is being a bitch
    // and need to write/find conversion utils between KeyAlgorithm and DigestAlgorithm
    // also need to write/find conversion util for KeyAlgorithm to shorthand string as seen here:
    // https://developers.google.com/identity/protocols/oauth2/service-account#httprest

    const hashBuffer = await crypto.subtle.digest(this.key.algorithm, encoder.encode(contents))
    return encodeB64(hashBuffer)
  }

  /**
   * Sign (create) JWT from payload
   * @param payload: Record<string, unknown>
   * @returns jwt: Promise<string>
   */
  async sign (payload: Record<string, unknown>): Promise<string> {
    if (!this.key) throw new Error("No valid crypto key.")

    const b64Header = encodeB64(JSON.stringify({
      alg: this.key.algorithm,
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
    if (!this.key) throw new Error("No valid crypto key.")

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