import { DefaultState } from "../../core/context.ts";
import { Middleware } from "../../core/types.ts";
import { Model } from "../../core/utils/Model.ts";
import { ValidationError } from "../../core/utils/ValidationError.ts";
import { QueryParser } from "../utils/QueryParser.ts";

export type QueryFieldData = Model | Model[] | Promise<Model> | Promise<Model[]> | null;

export type QueryResultData = {
  [key: string]: QueryFieldData;
};

export interface QueryState extends DefaultState {
  query: QueryParser;
  queryResult: {
    data: QueryResultData;
    errors: ValidationError[];
  }
}

export const parseQuery: Middleware<QueryState> = async (ctx) => {
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
    ctx.state.queryResult = {
      data: {},
      errors: []
    }
  } catch(e) {
    console.log(e); // TODO: make user handle this error?
    return new Response("Error parsing query from request body.", {
      status: 400
    });
  }
};