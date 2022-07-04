import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"
import { logError } from "./logger.ts"

const KEY = await crypto.subtle.generateKey({
  name: "HMAC",
  hash: {name: "SHA-512"}
}, true, ["sign", "verify"])

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const decodeJWT = async (jwt: string) => {
  let [ header, payload, signature ] = jwt.split(".")

  try {
    header = JSON.parse(atob(header))
    payload = JSON.parse(atob(payload))
    signature = decodeURIComponent(atob(signature))
  } catch(error) {
    logError("PARSE-JWT", error, new Date())
    return undefined
  }

  const signatureInput = btoa(`${header}.${payload}`)
  const valid = await crypto.subtle.verify({
    name: "HMAC",
    hash: {name: "SHA-512"}
  }, KEY, encoder.encode(signature), encoder.encode(signatureInput))
  if (!valid) return undefined

  return payload
}

export const generateJWT = async (sessionData: Record<string, unknown>) => {
  const header = btoa(JSON.stringify({
    alg: "HMAC",
    typ: "JWT"
  }))

  const payload = btoa(JSON.stringify(sessionData))

  const signatureInput = `${header}.${payload}`
  const signatureBuffer = await crypto.subtle.sign({
    name: "HMAC",
    hash: {name: "SHA-512"}
  }, KEY, encoder.encode(signatureInput))

  const signature = btoa(encodeURIComponent(decoder.decode(signatureBuffer)))

  return `${header}.${payload}.${signature}`
}