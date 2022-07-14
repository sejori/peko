import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

/**
 * Crypto class, designed to generate hashes and sign and verify JWTs.
 * @param alg: string
 * @returns jwt: JWT
 */
export class Crypto {
  key: string
  algorithm: string

  constructor(key?: string, alg?: string) {
    // if no key provided use prototype chain to get key from 
    // parent instance (PekoServer)
    this.key = key ? key : this.config.cryptoSecretKey
    this.algorithm = alg ? alg : "BLAKE3"

    console.log(this.config.cryptoSecretKey)
  }

  /**
   * Generate hash from string
   * @param contents: string
   * @returns hashHex: string
   */
  async hash (contents: string) {
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
  async sign (payload: Record<string, unknown>) {
    const b64Header = btoa(JSON.stringify({
      alg: this.algorithm,
      typ: "JWT"
    }))
    const b64Payload = btoa(JSON.stringify(payload))

    const signatureBuffer = await crypto.subtle.encrypt(this.algorithm, this.key, encoder.encode(`${b64Header}.${b64Payload}`))
    const signatureString = decoder.decode(signatureBuffer)
    const signature = btoa(encodeURIComponent(signatureString))

    return `${b64Header}.${b64Payload}.${signature}`
  }

  /**
   * Verify JWT
   * @param jwt: string
   * @returns payload: Record<string, unknown>
   */
  async verify (jwt: string) {
    const [ b64Header, b64Payload, b64Signature ] = jwt.split(".")

    const freshSigBuffer = await crypto.subtle.decrypt(this.algorithm, this.key, encoder.encode(`${b64Header}.${b64Payload}`))
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