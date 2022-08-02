import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { ssrHandler } from "../../handlers/ssr.ts"

Deno.test("HANDLER: SSR", async (t) => {
  const server = new Server({
    eventLogger: () => {},
    stringLogger: () => {}
  })
  const ctx = new RequestContext(server)
  const decoder = new TextDecoder()
  const cacheControl = 'max-age=60, stale-while-revalidate=10'
  let response: Response
  
  await t.step("Response body created from render function as expected", async () => {
    response = await ssrHandler({ render: () => '<p>I am HTML!</p>', cacheControl })(ctx)
    const reader = response.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === '<p>I am HTML!</p>')
    }
  })
  
  await t.step("ETAG header created from body as expected", () => {
    assert(response.headers.get('ETAG'))
  }) 

  await t.step("Cache-Control header set as expected", () => {
    assert(response.headers.get('Cache-Control') === cacheControl)
  }) 
})