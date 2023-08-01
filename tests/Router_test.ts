import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Router } from "./../lib/Router.ts"
import {
  testMiddleware2,
  testMiddleware3,
  testMiddleware1,
  testHandler
} from "./mocks/middleware.ts"

Deno.test("ROUTER: ADDING/REMOVING ROUTES", async (t) => {
  const router = new Router()

  await t.step("routes added with full route and string arg options", () => {
    router.addRoute({ path: "/route", handler: testHandler })
    router.addRoute("/anotherRoute", { handler: testHandler })
    router.addRoute("/anotherNotherRoute", testHandler)
    const finalRoute = router.addRoute("/anotherNotherNotherRoute", testMiddleware1, testHandler)

    assert(finalRoute.path === "/anotherNotherNotherRoute" && router.routes.length === 4)
  })

  await t.step("routes removed", () => {
    router.removeRoute("/route")
    router.removeRoute("/anotherRoute")
    router.removeRoute("/anotherNotherRoute")
    router.removeRoute("/anotherNotherNotherRoute")

    assert(router.routes.length === 0)
  })

  await t.step ("routers on server can be subsequently editted", () => {
    const aRouter = new Router()
    aRouter.addRoutes([
      { path: "/route", handler: testHandler },
      { path: "/route2", handler: testHandler },
      { path: "/route3", handler: testHandler }
    ])

    aRouter.use(aRouter.middleware)

    aRouter.removeRoute("/route")

    assert(!aRouter.routes.find(route => route.path === "/route"))
    assert(aRouter.routes.length === 2)
  })

  await t.step ("http shorthand methods work correctly", () => {
    const router = new Router()

    const getRoute = router.get({
      path: "/get",
      handler: () => new Response("GET")
    })
    const postRoute = router.post({
      path: "/post",
      handler: () => new Response("POST")
    })
    const putRoute =router.put({
      path: "/put",
      handler: () => new Response("PUT")
    })
    const deleteRoute = router.delete({
      path: "/delete",
      handler: () => new Response("DELETE")
    })

    assert(router.routes.length === 4)
    assert(getRoute.method === "GET")
    assert(postRoute.method === "POST")
    assert(putRoute.method === "PUT")
    assert(deleteRoute.method === "DELETE")
  })

  await t.step("Params correctly stored", () => {
    const router = new Router()
    router.addRoute("/hello/:id/world/:name", () => new Response("Hi!"))

    assert(router.routes[0].params["id"] === 2)
    assert(router.routes[0].params["name"] === 4)
  })
})

Deno.test("ROUTER: HANDLING REQUESTS", async (t) => {
  const router = new Router()
  router.middleware = []

  await t.step("routes added with full route and string arg options", async () => {
    router.addRoute({ path: "/route", handler: testHandler })
    router.addRoute("/anotherRoute", { handler: testHandler })
    router.addRoute("/anotherNotherRoute", testHandler)
    router.addRoute("/anotherNotherNotherRoute", testMiddleware2, testHandler)

    assert(router.routes.length === 4)

    const request = new Request("http://localhost:7777/route")
    const anotherRequest = new Request("http://localhost:7777/anotherRoute")
    const anotherNotherRequest = new Request("http://localhost:7777/anotherNotherRoute")
    const anotherNotherNotherRequest = new Request("http://localhost:7777/anotherNotherRoute")

    const response = await router.requestHandler(request)
    const anotherResponse = await router.requestHandler(anotherRequest)
    const anotherNotherResponse = await router.requestHandler(anotherNotherRequest)
    const anotherNotherNotherResponse = await router.requestHandler(anotherNotherNotherRequest)

    assert(response.status === 200)
    assert(anotherResponse.status === 200)
    assert(anotherNotherResponse.status === 200)
    assert(anotherNotherNotherResponse.status === 200)
  })

  await t.step("no route found triggers basic 404", async () => {    
    const request = new Request("http://localhost:7777/404")
    const response = await router.requestHandler(request)
    assert(response.status === 404)
  })

  await t.step("custom 404", async () => { 
    router.use(async (_, next) => {
      const response = await next()
      if (!response) return new Response("Uh-oh!", { status: 404 })
    })

    const request = new Request("http://localhost:7777/404")
    const response = await router.requestHandler(request)

    assert(response.status === 404)
    assert(await response.text() === "Uh-oh!")
  })

  await t.step("custom 500", async () => { 
    router.use(async (_, next) => {
      try {
        await next()
      } catch(_) {
        return new Response("Error! :(", { status: 500 })
      }
    })
    router.get("/error-test", () => { throw new Error("Oopsie!") })

    const request = new Request("http://localhost:7777/error-test")
    const response = await router.requestHandler(request)

    assert(response.status === 500)
    assert(await response.text() === "Error! :(")
  })

  await t.step("all middleware and handlers run", async () => {
    router.addRoute({
      path: "/test",
      middleware: [testMiddleware1, testMiddleware2, testMiddleware3],
      handler: testHandler
    })

    const request = new Request("http://localhost:7777/test")
    const response = await router.requestHandler(request)

    const body = await response.json()

    assert(body["middleware1"] && body["middleware2"] && body["middleware3"])
  })

  await t.step("params discovered in RequestContext creation", async () => {
    const newRouter = new Router();

    newRouter.addRoute("/hello/:id/world/:name", (ctx) => {
      return new Response(JSON.stringify({ id: ctx.params["id"], name: ctx.params["name"] }))
    })

    const res = await newRouter.requestHandler(new Request("http://localhost:7777/hello/123/world/bruno"))
    const json = await res.json()
    assert(json.id === "123" && json.name === "bruno")
  })
})
