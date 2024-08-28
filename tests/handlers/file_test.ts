import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { Router } from "../../lib/routers/_router.ts";
import { file } from "../../lib/handlers/file.ts";
import { RequestContext } from "../../lib/types.ts";

Deno.test("HANDLER: File", async (t) => {
  const server = new Router();
  const ctx = new RequestContext(server, new Request("http://localhost"));
  const fileURL = new URL(import.meta.url);
  const decoder = new TextDecoder();
  const cacheControl = "max-age=60, stale-while-revalidate=10";
  let response: Response;

  await t.step(
    "Response body created from file contents as expected",
    async () => {
      const handler = await file(fileURL, {
        headers: new Headers({
          "Cache-Control": cacheControl,
          "Content-Type": "application/javascript",
        }),
      });
      response = await handler(ctx);
      assert(response.body);
      const reader = response.body.getReader();

      let result = "";
      let { done, value } = await reader.read();
      while (!done) {
        result += decoder.decode(value);
        ({ done, value } = await reader.read());
      }
      assert(done);
      assert(result === decoder.decode(await Deno.readFile(fileURL)));
    }
  );

  await t.step("ETAG header created from URL as expected", () => {
    assert(response.headers.get("ETAG"));
  });

  await t.step("Custom headers set as expected", () => {
    assert(response.headers.get("Cache-Control") === cacheControl);
  });

  await t.step("Body transformed applied as expected", async () => {
    const testString = " extra text has been added here!";

    const handler = await file(fileURL, {
      transform: async (contents) => {
        const reader = contents.getReader();
        let result = "";
        let { done, value } = await reader.read();
        while (!done) {
          result += decoder.decode(value);
          ({ done, value } = await reader.read());
        }
        const text = result;
        return text + testString;
      },
      headers: new Headers({
        "Cache-Control": cacheControl,
        "Content-Type": "application/javascript",
      }),
    });

    const response = await handler(ctx);
    assert(response.body);

    const reader = response.body.getReader();
    let result = "";
    let { done, value } = await reader.read();
    while (!done) {
      result += decoder.decode(value);
      ({ done, value } = await reader.read());
    }
    assert(result.includes(testString));
  });
});
