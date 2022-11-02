import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../../server.ts"
import { authenticator } from "../../middleware/authenticator.ts"
import { Crypto } from "../../utils/Crypto.ts"

Deno.test("MIDDLEWARE: Authenticator", async (t) => {
  const successString = "Authorized!"
  const crypto = new Crypto("test_key")
  const server = new Server({ logger: () => {} })

  const testPayload = { iat: Date.now(), exp: Date.now() + 1000, data: { foo: "bar" }}
  const token = await crypto.sign(testPayload)

  const request = new Request('https://localhost:7777')
  request.headers.set("Authorization", `Bearer ${token}`)
  
  await t.step("Response authorized as expected", async () => {
    const ctx = new RequestContext(server, request)
    const response = await authenticator(crypto)(ctx, async() => await new Response(successString))

    assert(await response?.text() === successString)
    assert(response?.status === 200)
    assert(JSON.stringify(ctx.state.auth) === JSON.stringify(testPayload))
  }) 

  await t.step("Response unauthorized as expected", async () => {
    const ctx = new RequestContext(server)
    const response = await authenticator(crypto)(ctx, async() => await new Response(successString))

    assert(response?.status === 401)
    assert(!ctx.state.auth)
  }) 
})