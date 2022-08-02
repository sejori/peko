import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { sseHandler } from "../../handlers/sse.ts"
import { Emitter } from "../../utils/Emitter.ts"

Deno.test("MIDDLEWARE: Logger", async (t) => {
  const server = new Server({
    eventLogger: () => {},
    stringLogger: () => {}
  })
  const ctx = new RequestContext(server)
  const emitter = new Emitter()
  const decoder = new TextDecoder()
  const testData = {
    foo: "bar"
  }
  
  await t.step("Response created and event data emitted as expected", async () => {
    const response = await sseHandler(emitter)(ctx)
    const reader = response.body?.getReader()

    await emitter.emit(testData)

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === `data: ${JSON.stringify(testData)}\n\n`)
    }
  }) 
})