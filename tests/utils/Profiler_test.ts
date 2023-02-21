import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server } from "../../server.ts"
import Profiler from "../../utils/Profiler.ts"

Deno.test("UTIL: Profiler", async (t) => {
  const server = new Server()

  server.addRoute("/hello", () => {
    return new Response("Hello, World!")
  })

  server.addRoute("/goodbye", () => {
    return new Response("Goodbye, World!")
  })

  await t.step("profiles handled requests", async () => {
    const results = await Profiler.run(server, {
      mode: "handle",
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

  await t.step("profiles served requests", async () => {
    server.listen(8000, () => {})

    // can't await listen so timeout necessary
    await new Promise(res => setTimeout(res, 500))

    const results = await Profiler.run(server, {
      mode: "serve",
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

    server.close()
  })
});