import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { sseHandler } from "../../handlers/sse.ts"

Deno.test("HANDLER: Server-sent events", async (t) => {
  const server = new Server({ logging: () => {} })
  const ctx = new RequestContext(server, new Request("http://localhost"))
  const eventTarget = new EventTarget()
  const decoder = new TextDecoder()
  const testData = {
    foo: "bar"
  }
  
  await t.step("Response created and event data emitted as expected", async () => {
    const response = await sseHandler(eventTarget)(ctx)
    const reader = response.body?.getReader()

    const dataEvent = new CustomEvent("data", { detail: testData })
    const dob = dataEvent.timeStamp;
    eventTarget.dispatchEvent(dataEvent);

    if (reader) {
      const { value } = await reader?.read()
      const stringValue = decoder.decode(value)
      const JSONValue = JSON.parse(stringValue.slice(6))

      assert(stringValue.slice(0,6) === "data: ")
      assert(stringValue.slice(-2) === "\n\n")
      assert(JSONValue.detail.foo && JSONValue.detail.foo === "bar")
      assert(JSONValue.timeStamp === dob)
    }
  }) 
})