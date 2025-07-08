import { DefaultState } from "../../core/context.ts";
import { Middleware } from "../../core/types.ts";
import { QueryParser, QueryObjectValueType, QueryObject, QueryOperation } from "../utils/QueryParser.ts";

export interface QueryState extends DefaultState {
  operation: QueryOperation;
  ast: QueryObject;
  query: string;
  operationName: string | undefined;
  variables: QueryObjectValueType | undefined;
  extensions: Record<string, string> | undefined;
}

export const query: Middleware<QueryState> = async (ctx) => {
  const contentType = ctx.request.headers.get("Content-Type");
  try {
    if (contentType?.includes("application/json")) {
      const body = await ctx.request.json();
      ctx.state.query = body.query;
      ctx.state.operationName = body.operationName;
      ctx.state.variables = body.variables;
      ctx.state.extensions = body.extensions;
    } else {
      ctx.state.query = await ctx.request.text();
    }
    ctx.state.ast = new QueryParser(ctx.state.query).ast;
  } catch {
    return new Response("Error parsing query from request body.", {
      status: 400
    });
  }
};