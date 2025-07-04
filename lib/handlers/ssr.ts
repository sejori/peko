import { RequestContext } from "../context.ts";
import { Crypto } from "../utils/Crypto.ts";
import { mergeHeaders } from "../utils/helpers.ts";
import { Handler, HandlerOptions } from "../types.ts";

export type Render = (ctx: RequestContext) => BodyInit | Promise<BodyInit>;
export interface ssrHandlerOptions extends HandlerOptions {
  crypto?: Crypto;
}

/**
 * Generates Response with SSRData.render result in body
 * Sets headers "Content-Type" and "ETag" to "text/html" and body hash
 * @param render: (ctx: RequestContext) => string | Promise<string>
 * @param opts: (optional) ssrHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssr = (render: Render, opts: ssrHandlerOptions = {}): Handler => {
  const pekoCrypto = opts?.crypto || new Crypto("peko_ssr");

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
