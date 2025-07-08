import { DefaultState } from "../../core/context.ts";
import { Middleware } from "../../core/types.ts";
import { QueryParser } from "../utils/QueryParser.ts";

export interface QueryState extends DefaultState {
  query: QueryParser;
}

export const query: Middleware<QueryState> = async (ctx) => {
  let bodyText: string | null = null;
  const contentType = ctx.request.headers.get("Content-Type");
  
  try {
    if (contentType?.includes("application/json")) {
      const body = await ctx.request.json();
      bodyText = body.query || body.mutation || body.subscription;
    } else {
      bodyText = await ctx.request.text();
    }
  } catch {
    return new Response("Error parsing request body.", {
      status: 400
    });
  }
  
  if (bodyText === null || bodyText.trim() === '') {
    return new Response("No query provided", {
      status: 400
    });
  }
  
    try {
    // Parse the query into AST
    ctx.state.query = new QueryParser(bodyText);
  } catch (error) {
    return new Response("GraphQL parse error: " + (error as Error).message, {
      status: 400
    });
  }
};