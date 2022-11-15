import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { sseHandler } from "../../handlers/sse.ts"

Deno.test("HANDLER: Server-sent events", async (t) => {
  const server = new Server({ logging: () => {} })
  const ctx = new RequestContext(server)
  const eventTarget = new EventTarget()
  const decoder = new TextDecoder()
  const testData = {
    foo: "bar"
  }
  
  await t.step("Response created and event data emitted as expected", async () => {
    const response = await sseHandler(eventTarget)(ctx)
    const reader = response.body?.getReader()

    const dataEvent = new CustomEvent("data", { detail: testData })
    eventTarget.dispatchEvent(dataEvent);

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      const stringValue = decoder.decode(value)
      const JSONValue = JSON.parse(stringValue.slice(6))
      assert(JSONValue.detail.foo && JSONValue.detail.foo === "bar")
    }

    // assert accurate timestamp

    // assert data: start and double newline end
    // assert(decoder.decode(value) === `data: ${JSON.stringify({ detail: testData })}\n\n`)
  }) 
})