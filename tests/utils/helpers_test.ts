import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import {
  mergeHeaders,
  promisify,
  // keyToDigest,
  // keyToJWTHeader
} from "../../utils/helpers.ts"

Deno.test("UTIL: helpers", async (t) => {  
  await t.step("mergeHeaders", () => {
    assert(mergeHeaders)
  }) 

  await t.step("promisify", () => {
    assert(promisify)
  }) 

  // await t.step("keyToDigest", async () => {
  //   const encoder = new TextEncoder()
  //   const key = await crypto.subtle.importKey("raw", encoder.encode("qwertyuioplkjhgfdsazxcvbnm,./'`[]"), {
  //     name: "RSASSA-PKCS1-v1_5",
  //     hash: "SHA-256"
  //   }, false, ["sign", "verify"])

  //   assert(keyToDigest(key))
  // }) 

  // await t.step("keyToJWTHeader", () => {
  //   assert(keyToJWTHeader)
  // }) 
})