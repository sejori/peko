import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"
import { logError } from "./logger.ts"

// const KEY = await crypto.subtle.generateKey({
//   name: "HMAC",
//   hash: {name: "SHA-512"}
// }, true, ["sign", "verify"])

const encoder = new TextEncoder()
const decoder = new TextDecoder()

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

export const generateJWT = async (sessionData: Record<string, unknown>) => {
  const b64Header = btoa(JSON.stringify({
    alg: "HMAC",
    typ: "JWT"
  }))
  const b64Payload = btoa(JSON.stringify(sessionData))

  const signatureBuffer = await crypto.subtle.digest("BLAKE3", encoder.encode(`${b64Header}.${b64Payload}`))
  const signatureString = decoder.decode(signatureBuffer)
  const signature = btoa(encodeURIComponent(signatureString))

  return `${b64Header}.${b64Payload}.${signature}`
}