/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { Router } from "../../Router.ts";
import { Profile } from "../../utils/Profile.ts";

Deno.test("UTIL: Profiler", async (t) => {
  const router = new Router();

  router.addRoute("GET", "/hello", () => {
    return new Response("Hello, World!");
  });

  router.addRoute("GET", "/goodbye", () => {
    return new Response("Goodbye, World!");
  });

  await t.step("profiles handled requests", async () => {
    const results = await Profile.run(router, {
      mode: "handle",
      count: 10,
      excludedRoutes: [],
    });

    assert(typeof results === "object");
    assert(Object.keys(results).length === 2);

    assert(typeof results["/hello"].avgTime === "number");
    assert(Array.isArray(results["/hello"].requests));
    assert(results["/hello"].requests.length === 10);

    assert(typeof results["/goodbye"].avgTime === "number");
    assert(Array.isArray(results["/goodbye"].requests));
    assert(results["/goodbye"].requests.length === 10);

    await Promise.all(
      results["/hello"].requests.map((request) =>
        request.response.body?.cancel()
      )
    );
    await Promise.all(
      results["/goodbye"].requests.map((request) =>
        request.response.body?.cancel()
      )
    );
  });

  await t.step("profiles served requests", async () => {
    const abortController = new AbortController();
    Deno.serve({ signal: abortController.signal }, (req) => router.handle(req));

    const results = await Profile.run(router, {
      mode: "serve",
      url: "http://localhost:8000",
      count: 10,
      excludedRoutes: [],
    });

    assert(typeof results === "object");
    assert(Object.keys(results).length === 2);

    assert(typeof results["/hello"].avgTime === "number");
    assert(Array.isArray(results["/hello"].requests));
    assert(results["/hello"].requests.length === 10);

    assert(typeof results["/goodbye"].avgTime === "number");
    assert(Array.isArray(results["/goodbye"].requests));
    assert(results["/goodbye"].requests.length === 10);

    await Promise.all(
      results["/hello"].requests.map((request) =>
        request.response.body?.cancel()
      )
    );
    await Promise.all(
      results["/goodbye"].requests.map((request) =>
        request.response.body?.cancel()
      )
    );

    abortController.abort();
  });
});
