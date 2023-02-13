import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { staticDir } from "../../utils/staticDir.ts"

import { Server } from "../../Server.ts"

Deno.test("UTIL: staticDir", async (t) => {  
  await t.step("returns all file routes with supplied middleware and static handler", async () => {
    const server = new Server()
    const request = new Request('https://localhost:7777/utils/helpers_test.ts')

    let text = ''
    const routes = await staticDir(new URL("../", import.meta.url), () => { text = "I was set" })

    assert(routes.find(route => route.path.includes("handlers")))
    assert(routes.find(route => route.path.includes("middleware")))
    assert(routes.find(route => route.path.includes("mocks")))
    assert(routes.find(route => route.path.includes("utils")))

    server.addRoutes(routes)

    const response = await server.requestHandler(request)
    const fileText = await response.text()

    assert(fileText == await Deno.readTextFile(new URL("./helpers_test.ts", import.meta.url)))
    assert(text === "I was set")
  }) 
})