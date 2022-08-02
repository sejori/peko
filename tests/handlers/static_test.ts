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
  const cacheControl = 'max-age=60, stale-while-revalidate=10'
  let response: Response
  
  await t.step("Response body created from file contents as expected", async () => {
    response = await staticHandler({ fileURL, contentType: 'application/javascript', cacheControl })(ctx)
    const reader = response.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === decoder.decode(await Deno.readFile(fileURL)))
    }
  }) 

  await t.step("ETAG header created from body as expected", () => {
    assert(response.headers.get('ETAG'))
  }) 

  await t.step("Cache-Control header set as expected", () => {
    assert(response.headers.get('Cache-Control') === cacheControl)
  }) 
})