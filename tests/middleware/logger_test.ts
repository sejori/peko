import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { logger } from "../../middleware/logger.ts"

Deno.test("MIDDLEWARE: Logger", async (t) => {
  const successString = "Success!"

  let loggedData: unknown
  const server = new Server({ logging: (data) => { loggedData = data } })

  const testData = {
    foo: "bar"
  }
  
  await t.step("Response string and event logged as expected", async () => {
    const ctx = new RequestContext(server, new Request("http://localhost"), { ...testData })
    await logger(ctx, async () => await new Response(successString))
    await new Promise(res => setTimeout(res, 50))
    assert(ctx.state.foo === testData.foo)
    assert(loggedData)
  })
})