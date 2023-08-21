import { assert } from "https://deno.land/std@0.198.0/testing/asserts.ts"
import { Router, RequestContext } from "../../lib/Router.ts";
import { CacheItem, defaultKeyGen } from "../../lib/utils/CacheItem.ts"

Deno.test("UTIL: CacheItem", async (t) => {
  await t.step("constructor sets properties correctly", () => {
    const mockKey = "cache-key";
    const mockValue = new Response("cached content", { status: 200 });
    
    const cacheItem = new CacheItem(mockKey, mockValue);
  
    assert(cacheItem.key === mockKey);
    assert(cacheItem.value === mockValue);
    assert(cacheItem.dob <= Date.now());
    assert(cacheItem.count === 0);
  });

  await t.step("defaultKeyGen generates correct key", () => {
    const mockRouter = new Router();
    const mockRequest = new Request("http://localhost:3000/path?query=param");
    const mockState = { user: "Alice" };
  
    const ctx = new RequestContext(mockRouter, mockRequest, mockState);
    const result = defaultKeyGen(ctx);
  
    assert(result, "GET-/path?query=param-{\"user\":\"Alice\"}");
  });
})