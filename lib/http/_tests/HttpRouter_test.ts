import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { HttpRouter } from "../HttpRouter.ts";
import { DefaultState } from "../../core/context.ts";


Deno.test("ROUTER: HttpRouter", async (t) => {
  await t.step("http shorthand methods work correctly", () => {
    const router = new HttpRouter<DefaultState>();

    const getRoute = router.GET({
      path: "/get",
      handler: () => new Response("GET"),
    });
    const postRoute = router.POST({
      path: "/post",
      handler: () => new Response("POST"),
    });
    const patchRoute = router.PATCH({
      path: "/patch",
      handler: () => new Response("PATCH"),
    });
    const putRoute = router.PUT({
      path: "/put",
      handler: () => new Response("PUT"),
    });
    const deleteRoute = router.DELETE({
      path: "/delete",
      handler: () => new Response("DELETE"),
    });

    assert(Object.keys(router.routes).length === 5);
    assert(getRoute.method === "GET");
    assert(postRoute.method === "POST");
    assert(patchRoute.method === "PATCH");
    assert(putRoute.method === "PUT");
    assert(deleteRoute.method === "DELETE");
  });

  await t.step("Params correctly stored", () => {
    const router = new HttpRouter();
    const paramRoute = router.GET("/hello/:id/world/:name", () => new Response("Hi!"));

    assert(paramRoute.params["id"] === 2);
    assert(paramRoute.params["name"] === 4);
  });

  await t.step("params discovered in RequestContext creation", async () => {
    const newBaseRouter = new HttpRouter();

    newBaseRouter.GET("/hello/:id/world/:name", (ctx) => {
      return new Response(
        JSON.stringify({ id: ctx.params["id"], name: ctx.params["name"] })
      );
    });

    const res = await newBaseRouter.handle(
      new Request("http://localhost:7777/hello/123/world/bruno")
    );
    const json = await res.json() as { id: string; name: string };
    assert(json.id === "123" && json.name === "bruno");
  });

  await t.step("Regex path matches correctly", () => {
    const router = new HttpRouter();
    const route = router.GET("/hello/:id/world/:name", () => new Response("Hi!"));

    assert(route.regexPath.test("/hello/123/world/bruno"));
    assert(!route.regexPath.test("/hello/123/world/"));
    assert(!route.regexPath.test("/hello/123/world/bruno/extra"));
  });

  await t.step("Class based declaration works", () => {
    class MyRouter extends HttpRouter {
      hello = this.GET("/hello", () => new Response("Hello!"));
    }

    const myRouter = new MyRouter();
    assert(Object.keys(myRouter.routes).length === 1);
    assert(myRouter.hello.method === "GET");
  });
});

