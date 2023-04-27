import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server } from "../../lib/Server.ts"
import { Router } from "../../lib/utils/Router.ts"
import {
  testMiddleware1,
  testHandler,
} from "../mocks/middleware.ts"

Deno.test("SERVER", async (t) => {
  const router = new Router()

  await t.step("routes added with full route and string arg options", () => {
    router.addRoute({ path: "/route", handler: testHandler })
    router.addRoute("/anotherRoute", { handler: testHandler })
    router.addRoute("/anotherNotherRoute", testHandler)
    const routesLength = router.addRoute("/anotherNotherNotherRoute", testMiddleware1, testHandler)

    assert(routesLength === 4 && router.routes.length === 4)
  })

  await t.step("routes removed", () => {
    router.removeRoute("/route")
    router.removeRoute("/anotherRoute")
    router.removeRoute("/anotherNotherRoute")
    const routesLength = router.removeRoute("/anotherNotherNotherRoute")

    assert(routesLength === 0 && router.routes.length === 0)
  })

  await t.step ("routers on server can be subsequently editted", () => {
    const server = new Server()

    const aRouter = new Router([
      { path: "/route", handler: testHandler },
      { path: "/route2", handler: testHandler },
      { path: "/route3", handler: testHandler }
    ])

    server.use(aRouter)

    aRouter.removeRoute("/route")

    assert(!aRouter.routes.find(route => route.path === "/route"))
    assert(aRouter.routes.length === 2)
  })
})
