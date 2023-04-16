import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server, RequestContext } from "../../lib/server.ts"
import { authenticator } from "../../lib/middleware/authenticator.ts"
import { Crypto } from "../../lib/utils/Crypto.ts"

Deno.test("MIDDLEWARE: Authenticator", async (t) => {
  const successString = "Authorized!"
  const crypto = new Crypto("test_key")
  const server = new Server()

  const testPayload = { iat: Date.now(), exp: Date.now() + 1000, data: { foo: "bar" }}
  const token = await crypto.sign(testPayload)

  const request = new Request('https://localhost:7777')
  request.headers.set("Authorization", `Bearer ${token}`)
  
  await t.step("Response authorized as expected", async () => {
    const ctx = new RequestContext(server, request)
    const response = await authenticator(crypto)(ctx, () => new Response(successString))

    assert(await response?.text() === successString)
    assert(response?.status === 200)
    assert(JSON.stringify(ctx.state.auth) === JSON.stringify(testPayload))
  }) 

  await t.step("Response unauthorized as expected", async () => {
    const ctx = new RequestContext(server, new Request("http://localhost"))
    const response = await authenticator(crypto)(ctx, () => new Response(successString))

    assert(response?.status === 401)
    assert(!ctx.state.auth)
  }) 

  await t.step("works with cookie header too", async () => {
    const request2 = new Request('https://localhost:7777')
    request2.headers.set("Cookies", `Bearer ${token}`)

    const ctx = new RequestContext(server, request)
    const response = await authenticator(crypto)(ctx, () => new Response(successString))
  
    assert(response?.status === 200)
    assert(ctx.state.auth)
  })
})