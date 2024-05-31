import { RequestContext } from "../Router.ts";
import { mergeHeaders } from "../utils/helpers.ts";
import { parseAST } from "../utils/Graph";
import { Schema } from "../utils/Schema";
import { Handler, HandlerOptions } from "../types.ts";

export interface graphQLHandlerOptions extends HandlerOptions {
  loaders: Record<string, (input: any) => Promise<any>>;
}

export const graphQL = (
  schema: Schema,
  opts: graphQLHandlerOptions
): Handler => {
  return async function GraphQLHandler(ctx: RequestContext) {
    const ast = parseAST(await ctx.request.json());
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    return new Response(await schema.run(ast), {
      headers: opts.headers ? mergeHeaders(headers, opts.headers) : headers,
    });
  };
};
