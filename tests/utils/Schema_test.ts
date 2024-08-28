import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { mockSchemaRouter } from "../mocks/schemaRouter.ts";
import { generateSchema } from "../../lib/utils/Schema.ts";

Deno.test("ROUTER: SchemaRouter", async (t) => {
  const router = mockSchemaRouter();

  await t.step("creates the correct schema string", () => {
    const schemaString = generateSchema({
      scalars: router.scalars,
      routes: router.routes,
    });
    
    console.log(schemaString);
    assert(schemaString);
  });
});
