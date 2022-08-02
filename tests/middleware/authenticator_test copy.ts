import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { authenticator } from "../../middleware/authenticator.ts"
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("MIDDLEWARE: Authenticator", async (t) => {
  const successString = "Authorized!"
  const failureString = "Authorized!"
  const server = new Server({
    errorHandler: async (_ctx, _code) => await new Response(failureString),
    eventLogger: () => {},
    stringLogger: () => {}
  })
  const crypto = new Crypto("test_key")
  const testPayload = { iat: Date.now(), exp: Date.now() + 1000, data: { foo: "bar" }}
  const token = crypto.sign(testPayload)

  const ctx = new RequestContext(server, new Request({ headers: new Headers({ "Authorization": `Bearer ${token}` }) }))
  
  const decoder = new TextDecoder()
  
  await t.step("Response authorized as expected", async () => {
    const response = await authenticator(crypto)(ctx, async() => await new Response(successString))
    const reader = response?.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === successString)
      assert(response?.status === 200)
      assert(ctx.state.auth === testPayload)
    }
  }) 

  await t.step("Response unauthorized as expected", async () => {
    const response = await authenticator(crypto)(ctx, async() => await new Response(successString))
    const reader = response?.body?.getReader()

    if (reader) {
      const { done, value } = await reader?.read()
      assert(!done)
      assert(decoder.decode(value) === failureString)
      assert(response?.status === 401)
    }
  }) 
})