import { App } from "../lib/App.ts"
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1
} from "./mocks/middleware.ts"
import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"

Deno.test("APP", async (t) => {
  const app = new App()
  app.middleware = []

  await t.step("routes added with full route and string arg options", async () => {
    app.addRoute({ path: "/route", handler: testHandler })
    app.addRoute("/anotherRoute", { handler: testHandler })
    app.addRoute("/anotherNotherRoute", testHandler)
    app.addRoute("/anotherNotherNotherRoute", testMiddleware2, testHandler)

    assert(app.routes.length === 4)

    const request = new Request("http://localhost:7777/route")
    const anotherRequest = new Request("http://localhost:7777/anotherRoute")
    const anotherNotherRequest = new Request("http://localhost:7777/anotherNotherRoute")
    const anotherNotherNotherRequest = new Request("http://localhost:7777/anotherNotherRoute")

    const response = await app.requestHandler(request)
    const anotherResponse = await app.requestHandler(anotherRequest)
    const anotherNotherResponse = await app.requestHandler(anotherNotherRequest)
    const anotherNotherNotherResponse = await app.requestHandler(anotherNotherNotherRequest)

    assert(response.status === 200)
    assert(anotherResponse.status === 200)
    assert(anotherNotherResponse.status === 200)
    assert(anotherNotherNotherResponse.status === 200)
  })

  await t.step("no route found triggers basic 404", async () => {    
    const request = new Request("http://localhost:7777/404")
    const response = await app.requestHandler(request)
    assert(response.status === 404)
  })

  await t.step("custom 404", async () => { 
    app.use(async (_, next) => {
      const response = await next()
      if (!response) return new Response("Uh-oh!", { status: 404 })
    })

    const request = new Request("http://localhost:7777/404")
    const response = await app.requestHandler(request)

    assert(response.status === 404)
    assert(await response.text() === "Uh-oh!")
  })

  await t.step("custom 500", async () => { 
    app.use(async (_, next) => {
      try {
        await next()
      } catch(_) {
        return new Response("Error! :(", { status: 500 })
      }
    })
    app.addRoute("/error-test", () => { throw new Error("Oopsie!") })

    const request = new Request("http://localhost:7777/error-test")
    const response = await app.requestHandler(request)

    assert(response.status === 500)
    assert(await response.text() === "Error! :(")
  })

  await t.step("all middleware and handlers run", async () => {
    app.addRoute({
      path: "/test",
      middleware: [testMiddleware1, testMiddleware2, testMiddleware3],
      handler: testHandler
    })

    const request = new Request("http://localhost:7777/test")
    const response = await app.requestHandler(request)

    const body = await response.json()

    assert(body["middleware1"] && body["middleware2"] && body["middleware3"])
  })
})
