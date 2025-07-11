/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../context.ts";
import { cache } from "../../middleware/cache.ts";
import { testHandler } from "../mocks/middleware.ts";
import { CacheItem, defaultKeyGen } from "../../utils/CacheItem.ts";

Deno.test("MIDDLEWARE: Cacher", async (t) => {
  const successString = "Success!";
  const testData = {
    foo: "bar",
    hitCache: false,
    auth: null
  };

  const defaultCacher = cache();

  const itemMap: Map<string, CacheItem> = new Map();
  const CACHE_LIFETIME = 100;
  const customCacher = cache({
    itemLifetime: CACHE_LIFETIME,
    keyGen: (ctx) => "I-make-key" + defaultKeyGen(ctx),
    store: {
      get: (key) => itemMap.get(key),
      set: (key, value) => itemMap.set(key, value),
      delete: (key) => itemMap.delete(key),
    },
  });

  await t.step("Responses cached as expected", async () => {
    const ctx_default = new RequestContext(
      new Request("http://localhost"),
      { ...testData }
    );
    const ctx_custom = new RequestContext(
      new Request("http://localhost"),
      { ...testData }
    );
    const default_response1 = await defaultCacher(
      ctx_default,
      () => new Response(successString)
    );
    const custom_response1 = await customCacher(
      ctx_custom,
      () => new Response(successString)
    );
    assert(!ctx_default.state.hitCache);
    assert(ctx_default.state.foo === testData.foo);
    assert(!ctx_custom.state.hitCache);
    assert(ctx_custom.state.foo === testData.foo);

    const default_response2 = await defaultCacher(
      ctx_default,
      () => new Response(successString)
    );
    const custom_response2 = await customCacher(
      ctx_custom,
      () => new Response(successString)
    );
    assert(ctx_default.state.hitCache);
    assert(ctx_default.state.foo === testData.foo);
    assert(ctx_custom.state.hitCache);
    assert(ctx_custom.state.foo === testData.foo);

    const default_body1 = default_response1 && await default_response1.text();
    const default_body2 = default_response2 && await default_response2.text();
    assert(default_body1 === successString && default_body2 === successString);

    const custom_body1 = custom_response1 && await custom_response1.text();
    const custom_body2 = custom_response2 && await custom_response2.text();
    assert(custom_body1 === successString);
    assert(custom_body2 === successString);
  });

  await t.step("Cached response invalidated as expected", async () => {
    await new Promise((res) => setTimeout(res, CACHE_LIFETIME));
    const ctx = new RequestContext(new Request("http://localhost"), {
      ...testData,
    });
    const response = await customCacher(ctx, () => new Response(successString));
    const body = response && await response.text();

    assert(!ctx.state.hitCache && ctx.state.foo === testData.foo);
    assert(body === successString);
  });

  await t.step("memoize - preserve handler logic", async () => {
    const ctx = new RequestContext(new Request("http://localhost"), {
      hitCache: false,
      auth: { person: "wow!" },
      foo: "different"
    });
    const testRes = await testHandler(ctx);
    const memRes = await customCacher(ctx, () => testHandler(ctx));
    assert(memRes);

    const testJSON = await testRes.json();
    const memJSON2 = memRes && await memRes.json();

    assert(testJSON["foo"] === memJSON2["foo"]);
  });

  await t.step("return 304 with matching ETAG", async () => {
    const ETag = "1234567890";
    const ctx = new RequestContext(
      new Request("http://localhost/static-content?test-thing=hello", {
        headers: new Headers({ "if-none-match": ETag }),
      }),
      { hitCache: false }
    );

    const memRes = await customCacher(
      ctx,
      () =>
        new Response("hello", {
          headers: new Headers({ ETag: ETag }),
        })
    );
    const memRes2 = await customCacher(
      ctx,
      () =>
        new Response("hello", {
          headers: new Headers({ ETag: ETag }),
        })
    );

    assert(memRes && memRes.status === 200);
    assert(memRes2 && memRes2.status === 304);
  });
});
