import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server, RequestContext, PromiseMiddleware } from "../../server.ts"
import { Cascade } from "../../utils/Cascade.ts"
import { 
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "../../tests/mocks/middleware.ts"

Deno.test("UTIL: Cascade", async (t) => {
  const testServer = new Server()
  const testContext = new RequestContext(testServer, new Request("http://localhost"))
  const toCall = [
    testMiddleware1 as PromiseMiddleware, 
    testMiddleware2 as PromiseMiddleware, 
    testMiddleware3 as PromiseMiddleware, 
    testHandler as PromiseMiddleware
  ]

  const cascade = new Cascade(testContext, toCall)
  const result = await cascade.start()

  await t.step("cascade run as expected", async () => {
    // check async code before await next() call is properly awaited
    assert(
      (testContext.state.middleware1 as { start: number }).start
        <
      (testContext.state.middleware2 as { start: number }).start
    )

    assert(
      (testContext.state.middleware2 as { start: number }).start
        <
      (testContext.state.middleware3 as { start: number }).start
    )

    // ensure process finished in each middleware post await next()
    await new Promise(res => setTimeout(res, 25))

    // check each middleware in context has correct response
    assert((testContext.state.middleware1 as { res: Response }).res === result)
    assert((testContext.state.middleware2 as { res: Response }).res === result)
    assert((testContext.state.middleware3 as { res: Response }).res === result)

    // check context has end time for each middleware 
    // and that end of 2 is not less than 3 (and 1 !< 2)
    assert(
      (testContext.state.middleware1 as { end: number }).end
        >=
      (testContext.state.middleware2 as { end: number }).end
    )

    assert(
      (testContext.state.middleware2 as { end: number }).end
        >=
      (testContext.state.middleware3 as { end: number }).end
    )
  })
})
