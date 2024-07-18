import { RequestContext } from "../Router.ts";
import { mergeHeaders } from "../utils/helpers.ts";
import { Schema } from "../utils/Schema.ts";
import { Handler, HandlerOptions } from "../types.ts";

export interface graphQLHandlerOptions extends HandlerOptions {
  loaders: Record<string, (input: any) => Promise<any>>;
}

export const graphQL = (
  schema: Schema,
  opts: graphQLHandlerOptions
): Handler => {
  return async function GraphQLHandler(ctx: RequestContext) {
    // THIS IS WIP

    return new Response("WIP", {
      headers: mergeHeaders(
        new Headers({
          "Content-Type": "application/json",
        }),
        opts.headers
      ),
    });
  };
};
