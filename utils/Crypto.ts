import { crypto } from "https://deno.land/std@0.150.0/crypto/mod.ts"
import { DigestAlgorithm } from "https://deno.land/std@0.150.0/_wasm_crypto/mod.ts";
import { encode as encodeB64, decode as decodeB64 } from "https://deno.land/std@0.150.0/encoding/base64url.ts";
const encoder = new TextEncoder()

type Payload = {
  exp: number,
  iat: number,
  data: Record<string, unknown>
}

/**
 * Crypto class, generates hashes and signs and verifies JWTs using provided key.
 * @param alg: string
 * @returns jwt: JWT
 */
export class Crypto {
  key: CryptoKey | undefined
  rawKey: string | undefined
  algorithm: { name: string, hash: DigestAlgorithm } = { name: "HMAC", hash: "SHA-256" }

  constructor(key: CryptoKey | string) {
    if (typeof key === "string") {
      this.rawKey = key
    } else this.key = key
  }

  /**
   * Create CryptoKey from rawKey string to be used in crypto methods
   */
  async createCryptoKey(): Promise<void> {
    this.key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(await this.hash(this.rawKey as string)).buffer.slice(32),
      this.algorithm,
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
    const hashBuffer = await crypto.subtle.digest(
      this.algorithm.hash,
      encoder.encode(contents),
    )

    return encodeB64(hashBuffer)
  }

  /**
   * Sign (create) JWT from payload
   * @param payload: Record<string, unknown>
   * @returns jwt: string
   */
  async sign (payload: Payload): Promise<string> {
    if (!this.key) await this.createCryptoKey()

    const b64Header = btoa(JSON.stringify({
      alg: this.algorithm,
      typ: "JWT"
    }))
    const b64Payload = btoa(JSON.stringify(payload))

    const signatureBuffer = await crypto.subtle.sign(
      this.algorithm, 
      this.key as CryptoKey, 
      encoder.encode(`${b64Header}.${b64Payload}`)
    )
    const signature = encodeB64(signatureBuffer)

    return `${b64Header}.${b64Payload}.${signature}`
  }

  /**
   * Verify JWT and extract payload
   * @param jwt: string
   * @returns payload: Record<string, unknown>
   */
  async verify (jwt: string): Promise<Payload | undefined> {
    if (!this.key) await this.createCryptoKey()
    if (jwt.split(".").length != 3) return undefined
    
    const [ b64Header, b64Payload, b64Signature ] = jwt.split(".")

    const verified = await crypto.subtle.verify(
      this.algorithm, 
      this.key as CryptoKey, 
      decodeB64(b64Signature),
      encoder.encode(`${b64Header}.${b64Payload}`)
    )
    console.log(verified)
    if (!verified) return undefined
  
    try {
      const payload = JSON.parse(atob(b64Payload))
      return payload
    } catch(error) {
      throw(error)
    }
  }
}