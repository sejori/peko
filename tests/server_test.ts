import { Server } from "../lib/server.ts"
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1
} from "./mocks/middleware.ts"
import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"

Deno.test("SERVER", async (t) => {
  const server = new Server()
  server.middleware = []

  await t.step("routes added with full route and string arg options", async () => {
    server.addRoute({ path: "/route", handler: testHandler })
    server.addRoute("/anotherRoute", { handler: testHandler })
    server.addRoute("/anotherNotherRoute", testHandler)
    const routesLength = server.addRoute("/anotherNotherNotherRoute", testMiddleware2, testHandler)

    assert(routesLength === 4 && server.routes.length === 4)

    const request = new Request("http://localhost:7777/route")
    const anotherRequest = new Request("http://localhost:7777/anotherRoute")
    const anotherNotherRequest = new Request("http://localhost:7777/anotherNotherRoute")
    const anotherNotherNotherRequest = new Request("http://localhost:7777/anotherNotherRoute")

    const response = await server.requestHandler(request)
    const anotherResponse = await server.requestHandler(anotherRequest)
    const anotherNotherResponse = await server.requestHandler(anotherNotherRequest)
    const anotherNotherNotherResponse = await server.requestHandler(anotherNotherNotherRequest)

    assert(response.status === 200)
    assert(anotherResponse.status === 200)
    assert(anotherNotherResponse.status === 200)
    assert(anotherNotherNotherResponse.status === 200)
  })

  await t.step("no route found triggers basic 404", async () => {    
    const request = new Request("http://localhost:7777/404")
    const response = await server.requestHandler(request)
    assert(response.status === 404)
  })

  await t.step("custom 404", async () => { 
    server.use(async (_, next) => {
      const response = await next()
      if (!response) return new Response("Uh-oh!", { status: 404 })
    })

    const request = new Request("http://localhost:7777/404")
    const response = await server.requestHandler(request)

    assert(response.status === 404)
    assert(await response.text() === "Uh-oh!")
  })

  await t.step("custom 500", async () => { 
    server.use(async (_, next) => {
      try {
        await next()
      } catch(_) {
        return new Response("Error! :(", { status: 500 })
      }
    })
    server.addRoute("/error-test", () => { throw new Error("Oopsie!") })

    const request = new Request("http://localhost:7777/error-test")
    const response = await server.requestHandler(request)

    assert(response.status === 500)
    assert(await response.text() === "Error! :(")
  })

  await t.step("all middleware and handlers run", async () => {
    server.addRoute({
      path: "/test",
      middleware: [testMiddleware1, testMiddleware2, testMiddleware3],
      handler: testHandler
    })

    const request = new Request("http://localhost:7777/test")
    const response = await server.requestHandler(request)

    const body = await response.json()

    assert(body["middleware1"] && body["middleware2"] && body["middleware3"])
  })
})
