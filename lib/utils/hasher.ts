import { createHash } from "https://deno.land/std@0.140.0/hash/mod.ts";

export const hasher = (contents: string) => {
  const hash = createHash("md5")
  hash.update(contents)
  const hashString = hash.toString()

  return hashString
}