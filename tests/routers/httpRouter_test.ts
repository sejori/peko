import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { HttpRouter } from "../../lib/routers/httpRouter.ts";

Deno.test("ROUTER: HttpBaseRouter", async (t) => {
  await t.step("http shorthand methods work correctly", () => {
    const router = new HttpRouter();

    const getBaseRoute = router.get({
      path: "/get",
      handler: () => new Response("GET"),
    });
    const postBaseRoute = router.post({
      path: "/post",
      handler: () => new Response("POST"),
    });
    const putBaseRoute = router.put({
      path: "/put",
      handler: () => new Response("PUT"),
    });
    const deleteBaseRoute = router.delete({
      path: "/delete",
      handler: () => new Response("DELETE"),
    });

    assert(router.routes.length === 4);
    assert(getBaseRoute.method === "GET");
    assert(postBaseRoute.method === "POST");
    assert(putBaseRoute.method === "PUT");
    assert(deleteBaseRoute.method === "DELETE");
  });

  await t.step("Params correctly stored", () => {
    const router = new HttpRouter();
    router.addRoute("/hello/:id/world/:name", () => new Response("Hi!"));

    assert(router.routes[0].params["id"] === 2);
    assert(router.routes[0].params["name"] === 4);
  });

  await t.step("params discovered in RequestContext creation", async () => {
    const newBaseRouter = new HttpRouter();

    newBaseRouter.addRoute("/hello/:id/world/:name", (ctx) => {
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
});

