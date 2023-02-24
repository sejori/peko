import { RequestContext } from "../server.ts"
import { Handler, HandlerOptions } from "../types.ts"
import { Crypto } from "../utils/Crypto.ts"
import { mergeHeaders } from "../utils/helpers.ts"

export type Render = (ctx: RequestContext) => string | Promise<string>
export interface ssrHandlerOptions extends HandlerOptions {
  crypto?: Crypto
}

/**
 * Generates Response with SSRData.render result in body 
 * Sets headers "Content-Type" and "ETag" to "text/html" and bodyHash
 * @param render: (ctx: RequestContext) => string | Promise<string>
 * @param opts: (optional) ssrHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssrHandler = (render: Render, opts: ssrHandlerOptions = {}): Handler => async (ctx: RequestContext) => {
  if (!opts.crypto) {
    opts.crypto = new Crypto(crypto.randomUUID())
  }
  
  const HTML = await render(ctx)   
  const hashString = await opts.crypto.hash(HTML)

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "ETag": hashString
  })
  if (opts.headers) mergeHeaders(headers, opts.headers)

  return new Response(HTML, { headers })
}