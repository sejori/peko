import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { staticHandler } from "../../handlers/static.ts"

Deno.test("HANDLER: STATIC", async (t) => {
  const server = new Server({
    eventLogger: () => {},
    stringLogger: () => {}
  })
  const ctx = new RequestContext(server)
  const fileURL = new URL(import.meta.url)
  const decoder = new TextDecoder()
  
  await t.step("Response body created from file contents as expected", async () => {
    const response = await staticHandler({ fileURL, contentType: 'application/javascript' })(ctx)
    const reader = response.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === decoder.decode(await Deno.readFile(fileURL)))
    }
  }) 
})