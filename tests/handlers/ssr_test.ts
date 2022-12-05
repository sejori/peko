import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { ssrHandler } from "../../handlers/ssr.ts"

Deno.test("HANDLER: Server-side render", async (t) => {
  const server = new Server()
  const ctx = new RequestContext(server, new Request("http://localhost"))
  const decoder = new TextDecoder()
  const cacheControl = "max-age=60, stale-while-revalidate=10"
  let response: Response
  
  await t.step("Response body created from render function as expected", async () => {
    response = await ssrHandler(() => '<p>I am HTML!</p>', {
      headers: new Headers({ 
        "cache-control": cacheControl
      }) 
    })(ctx)

    const reader = response.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === '<p>I am HTML!</p>')
    }
  })
  
  await t.step("Content-Type & ETAG header created from body as expected", () => {
    assert(response.headers.get("ETAG"))
    assert(response.headers.get("content-type") === "text/html; charset=utf-8")
  }) 

  await t.step("Custom headers set as expected", () => {
    assert(response.headers.get("cache-control") === cacheControl)
  }) 
})