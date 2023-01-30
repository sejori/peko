import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import {
  mergeHeaders,
  promisify,
} from "../../utils/helpers.ts"

Deno.test("UTIL: helpers", async (t) => {  
  await t.step("mergeHeaders", () => {
    const base = new Headers({
      "Content-Type": "text/plain"
    })
    const source = new Headers({
      "Authorization": "Bearer asdf"
    })
    mergeHeaders(base, source)
    assert(base.has("Content-Type") && base.has("Authorization"))
  }) 

  await t.step("promisify", () => {
    const testServer = new Server()
    const testContext = new RequestContext(testServer, new Request("http://localhost"))
    const testMW = () => new Response("hello")
    const testMWProm = promisify(testMW)
    assert(testMWProm(testContext, () => {}) instanceof Promise)
  }) 
})