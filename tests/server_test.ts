import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server, RequestContext } from "../server.ts"
import {
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "./mock_data.ts"

Deno.test("SERVER", async (t) => {
  const server = new Server()
  const emptyFcn = () => {}
  const testErrorHandler = (ctx: RequestContext, status: number) => {
    return new Response(JSON.stringify({ ctx, status }), { status })
  }
  server.setConfig({
    stringLogger: emptyFcn,
    eventLogger: emptyFcn,
    errorHandler: testErrorHandler,
    globalMiddleware: [
      testMiddleware1,
      testMiddleware2
    ]
  })
  server.listen()

  await t.step("config updates and server starts", () => {
    assert(server.config.stringLogger === emptyFcn)
    assert(server.config.eventLogger === emptyFcn)
    assert(server.config.errorHandler === testErrorHandler)
  })

  await t.step("routes added", () => {
    const routesLength = server.addRoute({
      route: "/",
      handler: testHandler
    })

    assert(routesLength === 1 && server.routes.length === 1)
  })

  await t.step("routes removed", () => {
    const routesLength = server.removeRoute("/")

    assert(routesLength === 0 && server.routes.length === 0)
  })

  await t.step("error handler triggered with 404", async () => {
    const response = await fetch("http://localhost:7777/")
    const body = await response.json()
    // await new Promise(res => setTimeout(res, 100))
    assert(response.status === 404 && body.status === 404)
  })

  await t.step("error handler triggered with 500", async () => {
    server.addRoute({
      route: "/",
      handler: () => { throw new Error("ERROR") }
    })

    const response = await fetch("http://localhost:7777/")
    const body = await response.json()

    assert(response.status === 500 && body.status === 500)
  })

  await t.step("test all middleware and handlers run", async () => {
    server.addRoute({
      route: "/test",
      middleware: testMiddleware3,
      handler: testHandler
    })

    const response = await fetch("http://localhost:7777/test")
    const body = await response.json()

    assert(body["middleware1"] && body["middleware2"] && body["middleware3"])
  })
})
