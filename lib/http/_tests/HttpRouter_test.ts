import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { HttpRouteConfig, HttpRouter } from "../HttpRouter.ts";
import { DefaultState, RequestContext } from "../../core/context.ts";
import { auth, AuthState } from "../../core/middleware/auth.ts";
import { cache } from "../../core/middleware/cache.ts";
import { Krypto } from "../../core/utils/Krypto.ts";
import { HttpRouterFactory } from "../HttpRouter.ts";
import { Middleware } from "../../core/types.ts";
import { CacheState } from "../../../mod.ts";
import { validJSON, ValidJSON } from "../../core/middleware/valid.ts";
import { Model, ModelFactory } from "../../core/utils/Model.ts";
import { Field, FieldInterface } from "../../core/utils/Field.ts";

Deno.test("ROUTER: HttpRouter", async (t) => {
  await t.step("http shorthand methods work correctly", () => {
    const router = new HttpRouter<DefaultState>();

    const getRoute = router.GET("/get", () => new Response("GET"));
    const postRoute = router.POST("/post", () => new Response("POST"));
    const patchRoute = router.PATCH("/patch", () => new Response("PATCH"));
    const putRoute = router.PUT("/put", () => new Response("PUT"));
    const deleteRoute = router.DELETE("/delete", () => new Response("DELETE"));

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
      new Request("http://localhost:7777/hello/123/world/mylena")
    );
    const json = await res.json() as { id: string; name: string };
    assert(json.id === "123" && json.name === "mylena");
  });

  await t.step("Regex path matches correctly", () => {
    const router = new HttpRouter();
    const route = router.GET("/hello/:id/world/:name", () => new Response("Hi!"));

    assert(route.match(new RequestContext(new Request("http://localhost/hello/123/world/bruno"))));
    assert(!route.match(new RequestContext(new Request("http://localhost/hello/123/world/"))));
    assert(!route.match(new RequestContext(new Request("http://localhost/hello/123/world/bruno/extra"))));
  });

  await t.step("Class based declaration", async () => {
    const TestMiddleware: Middleware = (ctx) => {
      ctx.state.userPosts = ctx.state.json.testUsername 
        ? [ctx.state.json.testUsername + "'s post"] 
        : [];
    };

    class TestModel extends Model<{
      testUsername: FieldInterface<StringConstructor, true>;
    }> {
      static override schema = {
        testUsername: Field(String, {
          defaultValue: "test_person_123",
        })
      };
    }

    class MyRouter extends HttpRouter<AuthState & CacheState> {
      constructor() {
        super([
          auth(new Krypto('test123')), 
          cache()
        ]);
      }

      hello = this.addRoute<HttpRouteConfig<
        AuthState & CacheState & ValidJSON<typeof TestModel> & { userPosts: string[] }
      >>({
        method: "POST",
        path: "/hello",
        middleware: [
          validJSON(TestModel),
          TestMiddleware
        ], 
        handler: (ctx) => {
          ctx.state.auth = { person: "John Doe" };
          ctx.state.hitCache = true;
          return new Response(ctx.state.userPosts.join(", "));
        }
      });
    }

    const myRouter = new MyRouter();
    assert(Object.keys(myRouter.routes).length === 1);
    assert(myRouter.hello.method === "POST");

    // this is more of an integration test, so we will test the actual response
    const request = new Request("http://localhost:7777/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ testUsername: "test_user" }),
    });

    const res = await myRouter.handle(request);
    const resText = await res.text();
    assert(resText === "test_user's post");
  });

  await t.step("Factory-function based declaration", async () => {
    class TestModel extends ModelFactory({
      testUsername: Field(String, {
        defaultValue: "test_person_123",
      }),
    }) {}

    const TestMiddleware: Middleware<
      AuthState & DefaultState & ValidJSON<typeof TestModel> & { userPosts: string[] }
    > = (ctx) => {
      ctx.state.userPosts = ctx.state.json.testUsername 
        ? [ctx.state.json.testUsername + "'s post"] 
        : [];
    };
    
    class MyRouter extends HttpRouterFactory({
      middleware: [cache()]
    }) {
      hello = this.POST("/hello", [
        validJSON(TestModel), 
        TestMiddleware
      ], (ctx) => {
        ctx.state.auth = { person: "John Doe" };
        ctx.state.hitCache = true;
        return new Response(ctx.state.userPosts.join(", "));
      });
    }

    const myRouter = new MyRouter();
    assert(Object.keys(myRouter.routes).length === 1);
    assert(myRouter.hello.method === "POST");

    // this is more of an integration test, so we will test the actual response
    const request = new Request("http://localhost:7777/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ testUsername: "test_user" }),
    });

    const res = await myRouter.handle(request);
    const resText = await res.text();
    assert(resText === "test_user's post");
  });
});

