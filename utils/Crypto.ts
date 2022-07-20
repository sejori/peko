import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"
import { DigestAlgorithm } from "https://deno.land/std@0.144.0/_wasm_crypto/mod.ts";

const encoder = new TextEncoder()
const decoder = new TextDecoder()

type JWT = `${string}.${string}.${string}`
type Payload = {
  exp: number,
  iat: number,
  data: Record<string, unknown>
}

/**
 * Crypto class, designed to generate hashes and sign and verify JWTs.
 * @param alg: string
 * @returns jwt: JWT
 */
export class Crypto {
  rawKey: string
  algorithm: DigestAlgorithm
  key: CryptoKey | undefined

  constructor(rawKey: string, alg?: DigestAlgorithm) {
    // if no key provided use prototype chain to get key from 
    // parent instance (PekoServer)
    this.rawKey = rawKey
    this.algorithm = alg ? alg : "BLAKE3"
  }

  /**
   * Create CryptoKey from rawKey string to be used in crypto methods
   */
  async createCryptoKey(): Promise<void> {
    this.key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(this.rawKey),
      { name: "HMAC", hash: "SHA-256" },
      false, //extractable
      ["encrypt", "decrypt"]
    )

    console.log(this.key)
  }

  /**
   * Generate hash from string
   * @param contents: string
   * @returns hashHex: string
   */
  async hash(contents: string): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(
      this.algorithm,
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
  async sign (payload: Payload): Promise<JWT> {
    if (!this.key) await this.createCryptoKey()

    const b64Header = btoa(JSON.stringify({
      alg: this.algorithm,
      typ: "JWT"
    }))
    const b64Payload = btoa(JSON.stringify(payload))

    const signatureBuffer = await crypto.subtle.encrypt(this.algorithm, this.key as CryptoKey, encoder.encode(`${b64Header}.${b64Payload}`))
    const signatureString = decoder.decode(signatureBuffer)
    const signature = btoa(encodeURIComponent(signatureString))

    return `${b64Header}.${b64Payload}.${signature}`
  }

  /**
   * Verify JWT
   * @param jwt: string
   * @returns payload: Record<string, unknown>
   */
  async verify (jwt: string): Promise<Payload | undefined> {
    if (!this.key) await this.createCryptoKey()
    
    const [ b64Header, b64Payload, b64Signature ] = jwt.split(".")

    const freshSigBuffer = await crypto.subtle.decrypt(this.algorithm, this.key as CryptoKey, encoder.encode(`${b64Header}.${b64Payload}`))
    const freshSigString = decoder.decode(freshSigBuffer)
    const b64SigFresh = btoa(encodeURIComponent(freshSigString))
  
    if (b64Signature != b64SigFresh) return undefined
  
    try {
      const payload = JSON.parse(atob(b64Payload))
      return payload
    } catch(error) {
      throw(error)
    }
  }
}