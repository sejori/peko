import { DefaultState } from "../../core/context.ts";
import { Middleware } from "../../core/types.ts";
import { QueryParser, QueryObject } from "../utils/QueryParser.ts";

export interface QueryState extends DefaultState {
  query: QueryParser;
  queryResult: {
    data: QueryObject;
    errors: QueryObject[];
  }
}

export const query: Middleware<QueryState> = async (ctx) => {
  const contentType = ctx.request.headers.get("Content-Type");
  try {
    if (contentType?.includes("application/json")) {
      const body = await ctx.request.json();
      ctx.state.query = new QueryParser(body.query, {
        operationName: body.operationName,
        variables: body.variables,
        extensions: body.extensions
      });
    } else {
      ctx.state.query = new QueryParser(await ctx.request.text());
    }
    console.log(ctx.state.query);
    ctx.state.queryResult = {
      data: {},
      errors: []
    }
  } catch(e) {
    console.log(e);
    return new Response("Error parsing query from request body.", {
      status: 400
    });
  }
};