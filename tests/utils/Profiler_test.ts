import { assert } from "https://deno.land/std@0.190.0/testing/asserts.ts"
import { App } from "../../lib/App.ts"
import Profiler from "../../lib/utils/Profiler.ts"

Deno.test("UTIL: Profiler", async (t) => {
  const app = new App()

  app.addRoute("/hello", () => {
    return new Response("Hello, World!")
  })

  app.addRoute("/goodbye", () => {
    return new Response("Goodbye, World!")
  })

  await t.step("profiles handled requests", async () => {
    const results = await Profiler.run(app, {
      count: 10,
      excludedRoutes: [],
    })
  
    assert(typeof results === "object")
    assert(Object.keys(results).length === 2)
  
    assert(typeof results["/hello"].avgTime === "number")
    assert(Array.isArray(results["/hello"].requests))
    assert(results["/hello"].requests.length === 10)
  
    assert(typeof results["/goodbye"].avgTime === "number")
    assert(Array.isArray(results["/goodbye"].requests))
    assert(results["/goodbye"].requests.length === 10)

    await Promise.all(results["/hello"].requests.map(request => request.response.body?.cancel()))
    await Promise.all(results["/goodbye"].requests.map(request => request.response.body?.cancel()))
  })
});