import { assert } from "https://deno.land/std@0.198.0/testing/asserts.ts"
import { Router } from "../../lib/Router.ts"
import {
  mergeHeaders,
  routesFromDir
} from "../../lib/utils/helpers.ts"
import { staticFiles } from "../../lib/handlers/static.ts"

Deno.test("UTIL: helpers", async (t) => {  
  await t.step("mergeHeaders", () => {
    const base = new Headers({
      "Content-Type": "text/plain"
    })
    const source = new Headers({
      "Authorization": "Bearer asdf"
    })
    mergeHeaders(base, source)
    assert(base.has("Content-Type") && base.has("Authorization"))
  }) 

  await t.step("routesFromDir returns all file routes with supplied middleware and handler", async () => {
    const router = new Router()
    const request = new Request('https://localhost:7777/tests/utils/helpers_test.ts')

    let text = ''
    const routes = await routesFromDir(
      new URL("../", import.meta.url), 
      (path, url) => ({
        path: path,
        middleware: () => { text = "I was set" },
        handler: staticFiles(url)
      })
    )

    assert(routes.find(route => route.path.includes("handlers")))
    assert(routes.find(route => route.path.includes("middleware")))
    assert(routes.find(route => route.path.includes("mocks")))
    assert(routes.find(route => route.path.includes("utils")))
    assert(routes.find(route => route.path.includes("scripts")))

    router.addRoutes(routes)

    const response = await router.handle(request)
    const fileText = await response.text()

    assert(text === "I was set")
    assert(fileText == await Deno.readTextFile(new URL("./helpers_test.ts", import.meta.url)))
  }) 

  // TODO: sitemap test
})