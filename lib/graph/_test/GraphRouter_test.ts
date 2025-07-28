/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { GraphRouter } from "../GraphRouter.ts";
import { cache } from "../../core/middleware/cache.ts";
import { GraphRouterFactory } from "../GraphRouter.ts";
import { ModelFactory } from "../../core/utils/Model.ts";
import { FieldFactory } from "../../core/utils/Field.ts";
import { assertEquals } from "https://deno.land/std@0.218.0/assert/assert_equals.ts";
import { parseQuery } from "../middleware/parseQuery.ts";

Deno.test("ROUTER: GraphRouter", async (t) => {  
  const TestModel = ModelFactory({
    name: FieldFactory(String),
    data: FieldFactory(Number)
  });

  await t.step("http shorthand methods work correctly", () => {
    const router = new GraphRouter();

    const queryRoute = router.query("testQuery", () => new TestModel({
      name: "test",
      data: 5
    }));

    const mutationRoute = router.mutation("testMutation", () => new TestModel({
      name: "test2",
      data: 10
    }));

    const subscriptionRoute = router.subscription("testSubscription", () => new TestModel({
      name: "test3",
      data: 15
    }));

    assert(Object.keys(router.routes).length === 3);
    assert(queryRoute.method === "QUERY");
    assert(mutationRoute.method === "MUTATION");
    assert(subscriptionRoute.method === "SUBSCRIPTION");
  });

  await t.step("Factory-function based declaration", async () => {

    class MyGraphRouter extends GraphRouterFactory({
      middleware: [parseQuery, cache()]
    }) {
      hello = this.query("hello", () => {
        return new TestModel({
          name: "test",
          data: 5
        })
      });
    }

    const myRouter = new MyGraphRouter();
    assert(Object.keys(myRouter.routes).length === 1);
    assert(myRouter.hello.method === "QUERY");

    // this is more of an integration test, so we will test the actual response
    const request = new Request("http://localhost:7777", {
      method: "POST",
      body: `
        query {
          hello {
            name
            data
          }
        }
      `,
    });

    const res = await myRouter.handle(request);
    const resJson = await res.json();
    assertEquals(resJson, {
      data: {
        hello: {
          name: "test",
          data: 5
        }
      },
      errors: []
    });
  });
});

