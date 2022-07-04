import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"
import { logError } from "./log.ts"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

/**
 * Peko's internal JWT verifier and decoder
 * @param jwt: string
 * @returns payload | undefined
 */
export const decodeJWT = async (jwt: string) => {
  const [ b64Header, b64Payload, b64Signature ] = jwt.split(".")

  const freshSigBuffer = await crypto.subtle.digest("BLAKE3", encoder.encode(`${b64Header}.${b64Payload}`))
  const freshSigString = decoder.decode(freshSigBuffer)
  const b64SigFresh = btoa(encodeURIComponent(freshSigString))

  if (b64Signature != b64SigFresh) return undefined

  try {
    const payload = JSON.parse(atob(b64Payload))
    return payload
  } catch(error) {
    logError("PARSE-JWT", error, new Date())
    return undefined
  }
}

/**
 * Peko's internal JWT generator
 * @param payload: Record<string, unknown>
 * @returns JWT: string
 */
export const generateJWT = async (payload: Record<string, unknown>) => {
  const b64Header = btoa(JSON.stringify({
    alg: "HMAC",
    typ: "JWT"
  }))
  const b64Payload = btoa(JSON.stringify(payload))

  const signatureBuffer = await crypto.subtle.digest("BLAKE3", encoder.encode(`${b64Header}.${b64Payload}`))
  const signatureString = decoder.decode(signatureBuffer)
  const signature = btoa(encodeURIComponent(signatureString))

  return `${b64Header}.${b64Payload}.${signature}`
}