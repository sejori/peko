import {
  assert,
  assertEquals,
  assertInstanceOf,
  assertObjectMatch,
} from "https://deno.land/std@0.218.0/assert/mod.ts";
import { validJSON, ValidJSON } from "../../middleware/valid.ts";
import { Model } from "../../utils/Model.ts";
import { Field } from "../../utils/Field.ts";
import { RequestContext } from "../../context.ts";


class MockModel extends Model {
  static override schema = {
    username: Field(String, {
      validator: (v) => v.length > 3 
        ? { valid: true } 
        : { valid: false, message: "username length must be greater than 3" },
    }),
    age: Field(Number, {
      defaultValue: 18,
    }),
    gender: Field(String, {
      nullable: true,
      validator: (v) => v !== "Vulcan"
        ? { valid: false, message: "We don't accept your kind here" }
        : { valid: true }
    })
  };
}

Deno.test("validate middleware handles invalid JSON", async () => {
  const ctx = new RequestContext<ValidJSON<typeof Model>>(new Request("http://localhost:777/undefined", {
    headers: { "Content-Type": "text/plain" },
  }));
  
  const middleware = validJSON();
  const result = await middleware(ctx, () => {});
  
  assertInstanceOf(result, Response);
  assertEquals(result.status, 400);
  assertEquals(await result.text(), "Invalid Content-Type header, must be application/json.");
});

Deno.test("validate middleware parses valid JSON without model", async () => {
  const testData = { name: "Alice" };
  const ctx = new RequestContext<ValidJSON<typeof MockModel>>(new Request("http://localhost:777/undefined", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testData)
  }));
  
  const middleware = validJSON();
  const result = await middleware(ctx, () => {});
  
  assert(!result, "Should not return a response");
  assert(JSON.stringify(ctx.state.json) === JSON.stringify(testData));
});

Deno.test("validate middleware validates with model successfully", async () => {
  const validData = { username: "alice123" };
  const ctx = new RequestContext<ValidJSON<typeof MockModel>>(new Request("http://localhost:777/undefined", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validData)
  }));
  
  const middleware = validJSON(MockModel);
  const result = await middleware(ctx, () => {});
  
  assert(!result, "Should not return a response");
  assert(ctx.state.json.username == "alice123");
  assert(ctx.state.json.age == 18);
});

Deno.test("validate middleware returns validation errors", async () => {
  const invalidData = { username: "a" };
  const ctx = new RequestContext<ValidJSON<typeof MockModel>>(new Request("http://localhost:777/undefined", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invalidData)
  }));
  
  const middleware = validJSON(MockModel);
  const result = await middleware(ctx, () => {});
  
  assertInstanceOf(result, Response);
  assertEquals(result.status, 400);
  
  const text = await result.text();
  assert(text.includes("Validation failed"));
  assert(text.includes("username length must be greater than 3"));
});

Deno.test("validate middleware handles empty body with required field", async () => {
  const ctx = new RequestContext<ValidJSON<typeof MockModel>>(new Request("http://localhost:777/undefined", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }));
  
  const middleware = validJSON(MockModel);
  const result = await middleware(ctx, () => {});
  assertInstanceOf(result, Response);
  assertEquals(result.status, 400);
  
  const text = await result.text();
  assert(text.includes("Validation failed"));
  assert(text.includes("cannot be null"));
});

Deno.test("validate middleware preserves existing state", async () => {
  const testData = { name: "Bob" };
  const ctx = new RequestContext<{ existing: string } & ValidJSON<typeof MockModel>>(new Request("http://localhost:777/undefined", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testData)
  }));
  
  // Set existing state
  ctx.state.existing = "value";
  
  const middleware = validJSON();
  await middleware(ctx, () => {});
  
  assertEquals(ctx.state.existing, "value");
  assertObjectMatch(ctx.state.json, testData);
});