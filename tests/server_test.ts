import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import {
  server,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "./mock.ts"

Deno.test("SERVER", async (t) => {
  // TODO test RequestContext creation & hostname/port config

  await t.step("routes added with full route and string arg options", async () => {
    server.addRoute({ route: "/route", handler: testHandler })
    server.addRoute("/anotherRoute", { handler: testHandler })
    server.addRoute("/anotherNotherRoute", testHandler)
    const routesLength = server.addRoute("/anotherNotherNotherRoute", testMiddleware2, testHandler)

    assert(routesLength === 5 && server.routes.length === 5)

    const request = new Request("http://localhost:7777/")
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

  await t.step("routes removed", () => {
    server.removeRoute("/route")
    server.removeRoute("/anotherRoute")
    server.removeRoute("/anotherNotherRoute")
    const routesLength = server.removeRoute("/anotherNotherNotherRoute")

    assert(routesLength === 1 && server.routes.length === 1)
  })

  await t.step("no route found triggers basic 404", async () => {    
    const request = new Request("http://localhost:7777/")
    const response = await server.requestHandler(request)
    console.log(response)
    assert(response.status === 404)
  })

  await t.step("custom 404", async () => { 
    server.use(async (_, next) => {
      console.log("here")
      const response = await next()
      console.log("now here")
      console.log(response)
      if (!response) return new Response("...", { status: 404 })
    })

    console.log(server.middleware)

    const request = new Request("http://localhost:7777/")
    const response = await server.requestHandler(request)

    console.log(await response.text())

    assert(response.status === 404)
    assert(await response.text() === "Uh-oh!")
  })

  await t.step("custom 500", async () => { 
    server.addRoute("/error-test", () => { throw new Error("Oopsie!") })
    server.use(async (_, next) => {
      try {
        await next()
      } catch(_) {
        console.log("caught error!")
        return new Response("Error! :(", { status: 500 })
      }
    })
    const request = new Request("http://localhost:7777/error-test")
    const response = await server.requestHandler(request)

    assert(response.status === 500)
    assert(await response.text() === "Error! :(")
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
