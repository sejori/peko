import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { logger } from "../../middleware/logger.ts"

Deno.test("MIDDLEWARE: Logger", async (t) => {
  const successString = "Success!"

  let logOutput: unknown
  const server = new Server()

  const testData = {
    foo: "bar"
  }
  
  await t.step("Response string and event logged as expected", async () => {
    const ctx = new RequestContext(server, new Request("http://localhost"), { ...testData })
    const logFcn = logger((stuff) => { logOutput = stuff })
    await logFcn(ctx, () => new Response(successString))
    
    // TODO test this string
    console.log(logOutput)
    assert(logOutput)
  })
})