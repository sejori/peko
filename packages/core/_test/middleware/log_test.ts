/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../context.ts";
import { log } from "../../middleware/log.ts";

Deno.test("MIDDLEWARE: Logger", async (t) => {
  const successString = "Success!";
  let logOutput: unknown;
  const testData = {
    auth: null,
    hitCache: false,
    foo: "bar"
  };

  await t.step("Response string and event logged as expected", async () => {
    const ctx = new RequestContext(new Request("http://localhost"), {
      ...testData,
    });
    const logFcn = log((stuff) => {
      logOutput = stuff;
    });
    await logFcn(ctx, () => new Response(successString));

    // TODO test this string
    assert(logOutput);
  });
});
