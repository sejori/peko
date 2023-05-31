import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { App, RequestContext } from "../../lib/App.ts"
import { logger } from "../../lib/middleware/logger.ts"

Deno.test("MIDDLEWARE: Logger", async (t) => {
  const successString = "Success!"

  let logOutput: unknown
  const app = new App()

  const testData = {
    foo: "bar"
  }
  
  await t.step("Response string and event logged as expected", async () => {
    const ctx = new RequestContext(app, new Request("http://localhost"), { ...testData })
    const logFcn = logger((stuff) => { logOutput = stuff })
    await logFcn(ctx, () => new Response(successString))
    
    // TODO test this string
    console.log(logOutput)
    assert(logOutput)
  })
})