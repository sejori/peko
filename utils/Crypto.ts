import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"
import { DigestAlgorithm } from "https://deno.land/std@0.144.0/_wasm_crypto/mod.ts";

const encoder = new TextEncoder()
const decoder = new TextDecoder()

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
      ["sign"]
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
  
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
    return hashHex
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
    console.log(signatureBuffer)
    const signatureString = decoder.decode(signatureBuffer)
    console.log(signatureString)
    const signature = btoa(encodeURIComponent(signatureString))

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

    const sigStr = decodeURIComponent(atob(b64Signature))
    const sigBuff = encoder.encode(sigStr).buffer

    const freshSigBuff = await crypto.subtle.sign(
      this.algorithm, 
      this.key as CryptoKey, 
      encoder.encode(`${b64Header}.${b64Payload}`)
    )

    const verified = decoder.decode(sigBuff) === decoder.decode(freshSigBuff)
    if (!verified) return undefined
  
    try {
      const payload = JSON.parse(atob(b64Payload))
      return payload
    } catch(error) {
      throw(error)
    }
  }
}