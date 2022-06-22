import { crypto } from "https://deno.land/std@0.144.0/crypto/mod.ts"
import { logError } from "./logger.ts"

const KEY = await crypto.subtle.generateKey({ name: "BLAKE3" }, true, ["sign", "verify"])
// JWT implementation

export const decodeJWT = (jwt: string) => {
  let [ header, payload, signature ] = jwt.split(".")

  try {
    header = JSON.parse(atob(header))
    payload = JSON.parse(atob(payload))
  } catch(error) {
    logError("PARSE-JWT", error, new Date())
    return undefined
  }

  const signatureInput = Array.from(`${header}.${payload}`).map(v => Number(v))
  if (!crypto.subtle.verify({ name: "BLAKE3" }, KEY, signature, signatureInput)) return undefined

  return payload
}

export const generateJWT = (sessionData: Record<string, unknown>) => {
  const header = btoa(JSON.stringify({
    alg: "BLAKE3",
    typ: "JWT"
  }))

  const payload = btoa(JSON.stringify(sessionData))

  const signatureInput = Array.from(`${header}.${payload}`).map(v => Number(v))
  const signature = crypto.subtle.sign({ name: "BLAKE3" }, KEY, signatureInput)

  return `${header}.${payload}.${signature}`
}