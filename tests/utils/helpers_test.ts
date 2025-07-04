import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { mergeHeaders } from "../../lib/utils/helpers.ts";

Deno.test("UTIL: helpers", async (t) => {
  await t.step("mergeHeaders", () => {
    const base = new Headers({
      "Content-Type": "text/plain",
    });
    const source = new Headers({
      Authorization: "Bearer asdf",
    });
    const source2 = new Headers({
      ETAG: "1234",
    });
    mergeHeaders(base, source, source2);
    assert(
      base.has("Content-Type") && base.has("Authorization") && base.has("ETAG")
    );
  });
});
