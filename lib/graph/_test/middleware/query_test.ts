/// <reference lib="deno.ns" />

import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../../core/context.ts";
import { query, QueryState } from "../../middleware/query.ts";

// Helper to create test context
const createTestCtx = (
  body: string | Record<string, unknown>,
  headers: Record<string, string> = {},
  state?: Partial<QueryState>
) => new RequestContext(
  new Request("http://localhost/graphql", {
  method: "POST",
  headers: new Headers(headers),
  body: typeof body !== "string" ? JSON.stringify(body) : body as string
}),
  state as QueryState
);

Deno.test("MIDDLEWARE: query", async (t) => {
  // // Test valid JSON request with all fields
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
    
    assertEquals(ctx.state.query.text, testBody.query);
    assertEquals(ctx.state.query.opts.operationName, testBody.operationName);
    assertEquals(ctx.state.query.opts.variables, testBody.variables);
    assertEquals(ctx.state.query.opts.extensions, testBody.extensions);
    assertEquals(ctx.state.query.ast, {
      user: {
        ref: "user",
        fields: {
          name: { ref: "name" }
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
    
    assertEquals(ctx.state.query.text, testBody.query);
    assertEquals(ctx.state.query.opts.operationName, undefined);
    assertEquals(ctx.state.query.opts.variables, undefined);
    assertEquals(ctx.state.query.opts.extensions, undefined);
    assertEquals(ctx.state.query.ast, {
      user: {
        ref: "user",
        fields: {
          id: { ref: "id" }
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
    
    assertEquals(ctx.state.query.text, testQuery);
    assertEquals(ctx.state.query.opts.operationName, undefined);
    assertEquals(ctx.state.query.opts.variables, undefined);
    assertEquals(ctx.state.query.opts.extensions, undefined);
    assertEquals(ctx.state.query.ast, {
      posts: {
        ref: "posts",
        fields: {
          title: { ref: "title" }
        }
      }
    });
  });

  // Test missing Content-Type header
  await t.step("handles missing Content-Type header", async () => {
    const testQuery = "{ stats { views } }";
    const ctx = createTestCtx(testQuery);
    
    await query(ctx, () => {});
    
    assertEquals(ctx.state.query.text, testQuery);
    assertEquals(ctx.state.query.ast, {
      stats: {
        ref: "stats",
        fields: {
          views: { ref: "views" }
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
      query {
        # Basic field selection
        user(id: "123") {
          ...UserFields
          email
        }
        
        # Using aliases to request the same field with different arguments
        admin: user(role: "admin") {
          ...UserFields
        }
        moderator: user(role: "moderator") {
          ...UserFields
        }
        
        # Nested queries with arguments
        posts(first: 5, sortBy: "newest") {
          edges {
            node {
              title
              author {
                ...UserFields
              }
              comments(first: 3) @include(if: $includeComments) {
                text
                author {
                  ...UserFields
                }
              }
            }
          }
        }
      }
      fragment UserFields on User {
        id
        name
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
    
    assertEquals(ctx.state.query.text, testQuery);
    assertEquals(ctx.state.query.opts.variables, { id: "123" });
    assertEquals(ctx.state.query.operation, { type: "query", name: "", variables: {} });
    assertEquals(ctx.state.query.ast, {
      user: {
        ref: "user",
        args: { id: '"123"' },
        fields: {
          id: { ref: "id" },
          name: { ref: "name" },
          email: { ref: "email" }
        }
      },
      admin: {
        ref: "user",
        args: { role: '"admin"' },
        fields: {
          id: { ref: "id" },
          name: { ref: "name" }
        }
      },
      moderator: {
        ref: "user",
        args: { role: '"moderator"' },
        fields: {
          id: { ref: "id" },
          name: { ref: "name" }
        }
      },
      posts: {
        ref: "posts",
        args: {
          first: "5",
          sortBy: '"newest"'
        },
        fields: {
          edges: {
            ref: "edges",
            fields: {
              node: {
                ref: "node",
                fields: {
                  title: { ref: "title" },
                  author: {
                    ref: "author",
                    fields: {
                      id: { ref: "id" },
                      name: { ref: "name" }
                    }
                  },
                  comments: {
                    ref: "comments",
                    directives: ["@include(if:$includeComments)"],
                    args: { first: "3" },
                    fields: {
                      text: { ref: "text" },
                      author: {
                        ref: "author",
                        fields: {
                          id: { ref: "id" },
                          name: { ref: "name" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  });
});