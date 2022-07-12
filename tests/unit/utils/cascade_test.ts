import { assert } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { PekoServer, RequestContext } from "../../../server.ts"
import { cascadeRun, cascadeResolve } from "../../../utils/cascade.ts"
import { 
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "../server_test.ts"

Deno.test("UTIL: CASCADE", async (t) => {
  const testServer = new PekoServer()
  const testContext = new RequestContext(testServer, undefined, { foo: "bar" })

  const toRun = [ testMiddleware1, testMiddleware2, testMiddleware3, testHandler]
  const toResolve: { 
    resolve: (value: Response | PromiseLike<Response>) => void, 
    reject: (reason?: unknown) => void; 
  }[] = []

  // test array of SafeMiddlewares are cascaded properly
  await t.step("cascade middleware as expected", async () => {

    const results = await Promise.all(
      toRun.map(async fcn => await cascadeRun(testContext, fcn, toResolve))
    )
    const response = results.find(res => res)
    cascadeResolve(toResolve, response as Response)

    console.log(testContext)
  })
})