import { RequestContext } from "../Router.ts"
import { Crypto } from "../utils/Crypto.ts"
import { mergeHeaders } from "../utils/helpers.ts"
import { Handler, HandlerOptions } from "../types.ts"

export type Render = (ctx: RequestContext) => BodyInit | Promise<BodyInit>
export interface ssrHandlerOptions extends HandlerOptions {
  crypto?: Crypto
}

/**
 * Generates Response with SSRData.render result in body 
 * Sets headers "Content-Type" and "ETag" to "text/html" and body hash
 * @param render: (ctx: RequestContext) => string | Promise<string>
 * @param opts: (optional) ssrHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssr = (render: Render, opts: ssrHandlerOptions = {}): Handler => {
  return async function SSRHandler(ctx: RequestContext) {
    if (!opts.crypto) {
      opts.crypto = new Crypto(crypto.randomUUID())
    }

    const hashString = await opts.crypto.hash(await render(ctx))
    const headers = new Headers({
      "Content-Type": "text/html; charset=utf-8",
      "ETag": hashString
    })
    if (opts.headers) mergeHeaders(headers, opts.headers)

    return new Response(await render(ctx), { headers })
  }
}