import { assert } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { PekoServer, RequestContext } from "../../server.ts"
import { Cascade } from "../../utils/Cascade.ts"
import { 
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "../../tests/mock_data.ts"

Deno.test("UTIL: CASCADE", async (t) => {
  const cascade = new Cascade()
  const testServer = new PekoServer()
  const testContext = new RequestContext(testServer, undefined, { foo: "bar" })
  const toCall = [testMiddleware1, testMiddleware2, testMiddleware3, testHandler]
  let lex_response: Response
  let lex_toResolve: {
    resolve: (value: Response | PromiseLike<Response>) => void, 
    reject: (reason?: unknown) => void
  }[] = []

  await t.step("cascade run as expected", async () => {
    const { response, toResolve } = await cascade.forward(testContext, toCall)
    lex_response = response
    lex_toResolve = toResolve

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
  })

  await t.step("cascade resolve as expected", async () => {
    cascade.backward(lex_response, lex_toResolve)

    // ensure process finished in each middleware post await next()
    await new Promise(res => setTimeout(res, 25))

    // check each middleware in context has correct response
    assert((testContext.state.middleware1 as { res: Response }).res === lex_response)
    assert((testContext.state.middleware2 as { res: Response }).res === lex_response)
    assert((testContext.state.middleware3 as { res: Response }).res === lex_response)

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
