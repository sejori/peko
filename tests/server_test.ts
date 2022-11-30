import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server } from "../server.ts"
import {
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "./mock_data.ts"

Deno.test("SERVER", async (t) => {
  const emptyFcn = () => {}

  const server = new Server({
    logging: emptyFcn
  })

  server.use([
    testMiddleware1,
    testMiddleware2
  ])

  // TODO test request context creation

  await t.step("config updates and server starts", () => {
    assert(server.logging === emptyFcn)
  })

  await t.step("routes added with full route and string arg options", () => {
    server.addRoute({
      route: "/",
      handler: testHandler
    })

    server.addRoute("/anotherRoute", {
      handler: testHandler
    })

    const routesLength = server.addRoute("/anotherNotherRoute", testHandler)

    assert(routesLength === 3 && server.routes.length === 3)
  })

  await t.step("routes removed", () => {
    server.removeRoute("/")
    const routesLength = server.removeRoute("/anotherRoute")

    assert(routesLength === 0 && server.routes.length === 0)
  })

  await t.step("no route found triggers basic 404", async () => {    
    const request = new Request("http://localhost:7777/")
    const response = await server.requestHandler(request)

    assert(response.status === 404)
  })

  await t.step("all middleware and handlers run", async () => {
    server.addRoute({
      route: "/test",
      middleware: testMiddleware3,
      handler: testHandler
    })

    const request = new Request("http://localhost:7777/test")
    const response = await server.requestHandler(request)
    const body = await response.json()

    assert(body["middleware1"] && body["middleware2"] && body["middleware3"])
  })
})
