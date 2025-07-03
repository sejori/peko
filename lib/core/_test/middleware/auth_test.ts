/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../context.ts";
import { auth } from "../../middleware/auth.ts";
import { Krypto } from "../../utils/Krypto.ts";

Deno.test("MIDDLEWARE: Authenticator", async (t) => {
  const crypto = new Krypto("test_key");

  const testPayload = {
    iat: Date.now(),
    exp: Date.now() + 1000,
    data: { foo: "bar" },
  };
  const token = await crypto.sign(testPayload);

  const request = new Request("https://localhost:7777");
  request.headers.set("Authorization", `Bearer ${token}`);

  await t.step("Response authorized as expected", async () => {
    const ctx = new RequestContext(request, { auth: null });
    const response = await auth(crypto)(ctx, () => new Response('test'));

    assert(response instanceof Response && response.status === 200);
    assert(JSON.stringify(ctx.state.auth) === JSON.stringify(testPayload));
  });

  await t.step("Response unauthorized as expected", async () => {
    const noAuthRequest = new Request("https://localhost:7777");
    const ctx = new RequestContext(noAuthRequest, { auth: null });
    await auth(crypto)(ctx, () => new Response('test'));

    assert(!ctx.state.auth);
  });

  await t.step("works with cookie header too", async () => {
    const request2 = new Request("https://localhost:7777");
    request2.headers.set("Cookies", `Bearer ${token}`);

    const ctx = new RequestContext(request, { auth: null });
    const response = await auth(crypto)(ctx, () => new Response('test'));

    assert(response instanceof Response && response.status === 200);
    assert(ctx.state.auth);
  });
});
