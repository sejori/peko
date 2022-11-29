import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { staticHandler } from "../../handlers/static.ts"

Deno.test("HANDLER: Static", async (t) => {
  const server = new Server({ logging: () => {} })
  const ctx = new RequestContext(server, new Request("http://localhost"))
  const fileURL = new URL(import.meta.url)
  const decoder = new TextDecoder()
  const cacheControl = "max-age=60, stale-while-revalidate=10"
  let response: Response
  
  await t.step("Response body created from file contents as expected", async () => {
    response = await staticHandler(fileURL, {
      headers: new Headers({ 
        "Cache-Control": cacheControl,
        "Content-Type": "application/javascript"
      }) 
    })(ctx)
    const reader = response.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === decoder.decode(await Deno.readFile(fileURL)))
    }
  }) 

  await t.step("Content-Type & ETAG header created from body as expected", () => {
    assert(response.headers.get("ETAG"))
    assert(response.headers.get("Content-Type") === "application/javascript")
  }) 

  await t.step("Custom headers set as expected", () => {
    assert(response.headers.get("Cache-Control") === cacheControl)
  }) 

  await t.step("Body transformed applied as expected", async () => {
    const testString = " extra text has been added here!"

    response = await staticHandler(fileURL, {
      transform: async (contents: Uint8Array) => {
        const text = decoder.decode(contents)
        await new Promise(res => setTimeout(res, 10))
        return text + testString
      },
      headers: new Headers({ 
        "Cache-Control": cacheControl,
        "Content-Type": "application/javascript"
      }) 
    })(ctx)
    const reader = response.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value).includes(testString))
    }
  }) 
})