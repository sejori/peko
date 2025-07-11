/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../../core/context.ts";
import { sse } from "../../handlers/sse.ts";

Deno.test("HANDLER: Server-sent events", async (t) => {
  const ctx = new RequestContext(new Request("http://localhost"));
  const eventTarget = new EventTarget();
  const decoder = new TextDecoder();
  const testData = {
    foo: "bar",
  };

  await t.step(
    "Response created and event data emitted as expected",
    async () => {
      const response = await sse(eventTarget)(ctx);
      const reader = response.body?.getReader();

      const dataEvent = new CustomEvent("send", { detail: testData });
      const dob = dataEvent.timeStamp;
      eventTarget.dispatchEvent(dataEvent);

      if (reader) {
        const { value } = await reader?.read();
        const stringValue = decoder.decode(value);
        const JSONValue = JSON.parse(stringValue.slice(6));

        assert(stringValue.slice(0, 6) === "data: ");
        assert(stringValue.slice(-2) === "\n\n");
        assert(JSONValue.detail.foo && JSONValue.detail.foo === "bar");
        assert(JSONValue.timeStamp === dob);
      }
    }
  );
});
