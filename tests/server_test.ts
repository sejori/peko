import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server } from "../server.ts"
import {
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "./mock_data.ts"

Deno.test("SERVER", async (t) => {
  const server = new Server()
  const emptyFcn = () => {}

  server.setConfig({
    logger: emptyFcn,
    globalMiddleware: [
      testMiddleware1,
      testMiddleware2
    ]
  })

  // TODO test request context creation

  await t.step("config updates and server starts", () => {
    assert(server.config.logger === emptyFcn)
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

  await t.step("default not found handling triggers 404", async () => {    
    const request = new Request("http://localhost:7777/")
    const response = await server.requestHandler(request)

    assert(response.status === 404)
  })

  await t.step("default error handling triggers 500", async () => {
    server.addRoute({
      route: "/",
      handler: () => { throw new Error("ERROR") }
    })

    const request = new Request("http://localhost:7777/")
    const response = await server.requestHandler(request)

    assert(response.status === 500)
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
