import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { BaseRouter } from "../../lib/routers/_Router.ts";
import {
  testMiddleware2,
  testMiddleware3,
  testMiddleware1,
  testHandler,
} from "../mocks/middleware.ts";

Deno.test("ROUTER: BaseRouter managing routes", async (t) => {
  const router = new BaseRouter();

  await t.step(
    "routes added with full route and string arg options",
    async () => {
      router.addRoute("route1", testHandler);
      router.addRoute("route2", testMiddleware1, testHandler);
      router.addRoute("route3", {
        middleware: [testMiddleware1, testMiddleware2],
        handler: testHandler,
      })
      router.addRoute(
        "route4",
        [testMiddleware1, testMiddleware2],
        testHandler
      );

      assert(router.routes.length === 4);

      const request1 = new Request("http://localhost:7777/route1");
      const request2 = new Request("http://localhost:7777/route2");
      const request3 = new Request("http://localhost:7777/route3");
      const request4 = new Request("http://localhost:7777/route4");

      const response1 = await router.handle(request1);
      const response2 = await router.handle(request2);
      const response3 = await router.handle(request3);
      const response4 = await router.handle(request4);

      assert(response1.status === 200);
      assert(response2.status === 200);
      assert(response3.status === 200);
      assert(response4.status === 200);
    }
  );

  await t.step("routes removed", () => {
    router.removeRoute("route1");
    router.removeRoute("route2");
    router.removeRoute("route3");
    router.removeRoute("route4");

    assert(router.routes.length === 0);
  });

  await t.step("routers on server can be subsequently editted", () => {
    const aBaseRouter = new BaseRouter();
    aBaseRouter.addRoutes([
      { path: "route", middleware: [], handler: testHandler },
      { path: "route2", handler: testHandler },
      { path: "route3", handler: testHandler },
    ]);

    aBaseRouter.use(aBaseRouter.middleware);

    aBaseRouter.removeRoute("route");

    assert(!aBaseRouter.routes.find((route) => route.path === "route"));
    assert(aBaseRouter.routes.length === 2);
  });
});

Deno.test("ROUTER: BaseRouter - request handling", async (t) => {
  const router = new BaseRouter();
  router.middleware = [];

  await t.step("no route found triggers basic 404", async () => {
    const request = new Request("http://localhost:7777/404");
    const response = await router.handle(request);
    assert(response.status === 404);
  });

  await t.step("custom 404", async () => {
    router.use(async (_, next) => {
      const response = await next();
      if (!response) return new Response("Uh-oh!", { status: 404 });
    });

    const request = new Request("http://localhost:7777/404");
    const response = await router.handle(request);

    assert(response.status === 404);
    assert((await response.text()) === "Uh-oh!");
  });

  await t.step("custom 500", async () => {
    router.use(async (_, next) => {
      try {
        await next();
      } catch (_) {
        return new Response("Error! :(", { status: 500 });
      }
    });
    router.addRoute("/error-test", () => {
      throw new Error("Oopsie!");
    });

    const request = new Request("http://localhost:7777/error-test");
    const response = await router.handle(request);

    assert(response.status === 500);
    assert((await response.text()) === "Error! :(");
  });

  await t.step("all middleware and handlers run", async () => {
    router.addRoute({
      path: "test",
      middleware: [testMiddleware1, testMiddleware2, testMiddleware3],
      handler: testHandler,
    });

    const request = new Request("http://localhost:7777/test");
    const response = await router.handle(request);

    const body = await response.json();

    assert(body["middleware1"] && body["middleware2"] && body["middleware3"]);
  });
});
