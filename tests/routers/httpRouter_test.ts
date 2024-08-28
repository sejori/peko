import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { HttpRouter } from "../../lib/routers/httpRouter.ts";

Deno.test("ROUTER: ADDING/REMOVING ROUTES", async (t) => {
  await t.step("http shorthand methods work correctly", () => {
    const router = new HttpRouter();

    const getRoute = router.get({
      path: "/get",
      handler: () => new Response("GET"),
    });
    const postRoute = router.post({
      path: "/post",
      handler: () => new Response("POST"),
    });
    const putRoute = router.put({
      path: "/put",
      handler: () => new Response("PUT"),
    });
    const deleteRoute = router.delete({
      path: "/delete",
      handler: () => new Response("DELETE"),
    });

    assert(router.routes.length === 4);
    assert(getRoute.method === "GET");
    assert(postRoute.method === "POST");
    assert(putRoute.method === "PUT");
    assert(deleteRoute.method === "DELETE");
  });

  await t.step("Params correctly stored", () => {
    const router = new HttpRouter();
    router.addRoute("/hello/:id/world/:name", () => new Response("Hi!"));

    assert(router.routes[0].params["id"] === 2);
    assert(router.routes[0].params["name"] === 4);
  });
});
