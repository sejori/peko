import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../context.ts";
import { Cascade } from "../../utils/Cascade.ts";
import {
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler,
  CascadeTestContext,
} from "../mocks/middleware.ts";
import { Middleware } from "../../types.ts";

Deno.test("UTIL: Cascade", async (t) => {
  const testContext = new RequestContext<CascadeTestContext>(
    new Request("http://localhost")
  );
  const testMiddleware = [
    testMiddleware1,
    testMiddleware2,
    testMiddleware3,
    testHandler,
  ];

  const cascade = new Cascade(testContext, testMiddleware);
  const result = await cascade.run();

  await t.step("promisify works", () => {
    const testMW: Middleware = () => new Response("hello");
    const testMWProm = Cascade.promisify(testMW);
    assert(testMWProm(testContext, () => {}) instanceof Promise);
  });

  await t.step("cascade run as expected", async () => {
    // check async code before await next() call is properly awaited
    assert(
      (testContext.state.middleware1 as { start: number }).start <
        (testContext.state.middleware2 as { start: number }).start
    );

    assert(
      (testContext.state.middleware2 as { start: number }).start <
        (testContext.state.middleware3 as { start: number }).start
    );

    // ensure process finished in each middleware post await next()
    await new Promise((res) => setTimeout(res, 25));

    // check each middleware in context has correct response
    assert((testContext.state.middleware1 as { res: Response }).res === result);
    assert((testContext.state.middleware2 as { res: Response }).res === result);
    assert((testContext.state.middleware3 as { res: Response }).res === result);

    // check context has end time for each middleware
    // and that end of 2 is not less than 3 (and 1 !< 2)
    assert(
      (testContext.state.middleware1 as { end: number }).end >=
        (testContext.state.middleware2 as { end: number }).end
    );

    assert(
      (testContext.state.middleware2 as { end: number }).end >=
        (testContext.state.middleware3 as { end: number }).end
    );
  });

  // TODO: test post response ops don't block serving request

  // TODO: test returning response mid-cascade skips subsequent middleware
});
