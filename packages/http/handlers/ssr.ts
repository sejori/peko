import { RequestContext } from "../../core/types.ts";
import { Krypto } from "../../auth/utils/Krypto.ts";
import { mergeHeaders } from "../utils/mergeHeaders.ts";
import { Handler, HandlerOptions } from "../../core/types.ts";

export type Render = (ctx: RequestContext) => BodyInit | Promise<BodyInit>;
export interface ssrHandlerOptions extends HandlerOptions {
  krypto?: Krypto;
}

/**
 * Generates Response with SSRData.render result in body
 * Sets headers "Content-Type" and "ETag" to "text/html" and body hash
 * @param render: (ctx: RequestContext) => string | Promise<string>
 * @param opts: (optional) ssrHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssr = (render: Render, opts: ssrHandlerOptions = {}): Handler => {
  const pekoCrypto = opts?.krypto || new Krypto("peko_ssr");

  return async function SsrHandler(ctx: RequestContext) {
    const hashString = await pekoCrypto.hash(await render(ctx));
    const headers = new Headers({
      "Content-Type": "text/html; charset=utf-8",
      ETag: hashString,
    });

    return new Response(await render(ctx), {
      headers: opts.headers ? mergeHeaders(headers, opts.headers) : headers,
    });
  };
};
