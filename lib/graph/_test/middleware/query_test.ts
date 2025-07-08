/// <reference lib="deno.ns" />

import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../../core/context.ts";
import { query, QueryState } from "../../middleware/query.ts";

// Helper to create test context
const createTestCtx = (
  body: string | Record<string, unknown>,
  headers: Record<string, string> = {},
  state?: Partial<QueryState>
) => {
  const isJson = typeof body !== "string";
  const init: RequestInit = {
    method: "POST",
    headers: new Headers(headers),
    body: isJson ? JSON.stringify(body) : body as string
  };
  
  return new RequestContext(
    new Request("http://localhost/graphql", init),
    state as QueryState
  );
};

Deno.test("MIDDLEWARE: query", async (t) => {
  // Test valid JSON request with all fields
  await t.step("handles valid JSON request with all fields", async () => {
    const testBody = {
      query: "query { user { name } }",
      operationName: "GetUser",
      variables: { id: "123" },
      extensions: { tracing: "enabled" }
    };
    
    const ctx = createTestCtx(testBody, {
      "Content-Type": "application/json"
    });
    
    await query(ctx, () => {});
    
    assertEquals(ctx.state.query, testBody.query);
    assertEquals(ctx.state.operationName, testBody.operationName);
    assertEquals(ctx.state.variables, testBody.variables);
    assertEquals(ctx.state.extensions, testBody.extensions);
    assertEquals(ctx.state.ast, {
      user: {
        fields: {
          name: {}
        }
      }
    });
  });

  // Test JSON request with only query field
  await t.step("handles JSON request with only query field", async () => {
    const testBody = { query: "{ user { id } }" };
    const ctx = createTestCtx(testBody, {
      "Content-Type": "application/json"
    });
    
    await query(ctx, () => {});
    
    assertEquals(ctx.state.query, testBody.query);
    assertEquals(ctx.state.operationName, undefined);
    assertEquals(ctx.state.variables, undefined);
    assertEquals(ctx.state.extensions, undefined);
    assertEquals(ctx.state.ast, {
      user: {
        fields: {
          id: {}
        }
      }
    });
  });

  // Test plain text request
  await t.step("handles plain text request", async () => {
    const testQuery = "query { posts { title } }";
    const ctx = createTestCtx(testQuery, {
      "Content-Type": "text/plain"
    });
    
    await query(ctx, () => {});
    
    assertEquals(ctx.state.query, testQuery);
    assertEquals(ctx.state.operationName, undefined);
    assertEquals(ctx.state.variables, undefined);
    assertEquals(ctx.state.extensions, undefined);
    assertEquals(ctx.state.ast, {
      posts: {
        fields: {
          title: {}
        }
      }
    });
  });

  // Test missing Content-Type header
  await t.step("handles missing Content-Type header", async () => {
    const testQuery = "{ stats { views } }";
    const ctx = createTestCtx(testQuery);
    
    await query(ctx, () => {});
    
    assertEquals(ctx.state.query, testQuery);
    assertEquals(ctx.state.ast, {
      stats: {
        fields: {
          views: {}
        }
      }
    });
  });

  // Test invalid JSON body
  await t.step("returns 400 for invalid JSON", async () => {
    const ctx = createTestCtx("{ invalid json }", {
      "Content-Type": "application/json"
    });
    
    const response = await query(ctx, () => {});
    
    assertEquals(response?.status, 400);
    assertEquals(await response?.text(), "Error parsing query from request body.");
  });

  // Test invalid GraphQL syntax
  await t.step("returns 400 for invalid GraphQL syntax", async () => {
    const ctx = createTestCtx("query { user(id: \"123) }", {
      "Content-Type": "text/plain"
    });
    
    const response = await query(ctx, () => {});
    
    assertEquals(response?.status, 400);
    assertEquals(await response?.text(), "Error parsing query from request body.");
  });

  // Test complex query with all features
  await t.step("handles complex GraphQL query", async () => {
    const testQuery = `
      query getUserData($id: ID!) {
        me: user(id: $id) @include(if: true) {
          name
          ...userFields
        }
      }
      fragment userFields on User {
        email
      }
    `;
    
    const ctx = createTestCtx(
      {
        query: testQuery,
        variables: { id: "123" }
      },
      { "Content-Type": "application/json" }
    );
    
    await query(ctx, () => {});
    
    assertEquals(ctx.state.query, testQuery);
    assertEquals(ctx.state.variables, { id: "123" });
    assertEquals(ctx.state.ast, {
      me: {
        alias: "user",
        args: {
          id: "$id"
        },
        directives: ["@include(if:true)"],
        fields: {
          name: {},
          email: {}
        }
      }
    });
  });
});