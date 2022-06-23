import { crypto } from "https://deno.land/std@0.142.0/crypto/mod.ts";

/**
 * Peko's internal hashing function for generating ETags etc.
 * 
 * @param contents: string
 * @returns hashString: string
 */
export const hasher = async (contents: string) => {
  const hashBuffer = await crypto.subtle.digest(
    "BLAKE3",
    new TextEncoder().encode(contents),
  )

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}