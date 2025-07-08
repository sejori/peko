/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { RequestContext } from "../../../core/context.ts";
import { query, QueryState } from "../../middleware/query.ts";

const createTestGraphCtx = <S extends QueryState>(query: string, state?: S) => {
  return new RequestContext(new Request("http://localhost/graphql", {
    method: "POST",
    body: query
  }), state);
}

Deno.test("MIDDLEWARE: query", async (t) => {
  await t.step("Response string and event logged as expected", async () => {
    const ctx = createTestGraphCtx(`
      query {
        # Basic field selection
        user(id: "123") {
          id
          name
          email
        }
        
        # Using aliases to request the same field with different arguments
        admin: user(role: "admin") {
          id
          name
        }
        moderator: user(role: "moderator") {
          id
          name
        }
        
        # Nested queries with arguments
        posts(first: 5, sortBy: "newest") {
          edges {
            node {
              title
              author {
                name
              }
              comments(first: 3) @include(if: $includeComments) {
                text
                author
              }
            }
          }
        }
      }
    `);

    await query(ctx, () => {});

  
  });
});
