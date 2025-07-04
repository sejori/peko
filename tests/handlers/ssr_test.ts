import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../lib/context.ts";
import { BaseRouter } from "../../lib/routers/_Router.ts";
import { ssr } from "../../lib/handlers/ssr.ts";

Deno.test("HANDLER: Server-side render", async (t) => {
  const server = new BaseRouter();
  const ctx = new RequestContext(server, new Request("http://localhost"));
  const decoder = new TextDecoder();
  const cacheControl = "max-age=60, stale-while-revalidate=10";
  let response: Response;

  await t.step(
    "Response body created from render function as expected",
    async () => {
      response = await ssr(() => "<p>I am HTML!</p>", {
        headers: new Headers({
          "cache-control": cacheControl,
        }),
      })(ctx);
      assert(response.body);
      const reader = response.body.getReader();

      let result = "";
      let { done, value } = await reader.read();
      while (!done) {
        result += decoder.decode(value);
        ({ done, value } = await reader.read());
      }

      assert(result === "<p>I am HTML!</p>");
      assert(done);
    }
  );

  await t.step(
    "Content-Type & ETAG header created from body as expected",
    () => {
      assert(response.headers.get("ETAG"));
      assert(
        response.headers.get("content-type") === "text/html; charset=utf-8"
      );
    }
  );

  await t.step("Custom headers set as expected", () => {
    assert(response.headers.get("cache-control") === cacheControl);
  });
});
