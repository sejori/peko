import { RequestContext, Handler, HandlerOptions } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"
import { mergeHeaders } from "../utils/helpers.ts"

// random crypto just for ETag generation
const crypto = new Crypto(Array.from({length: 10}, () => Math.floor(Math.random() * 9)).toString())

export type Render = (ctx: RequestContext) => string | Promise<string>

/**
 * Generates Response with SSRData.render result in body 
 * Sets headers "Content-Type" and "ETag" to "text/html" and bodyHash
 * @param render: (ctx: RequestContext) => string | Promise<string>
 * @param opts: (optional) HandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssrHandler = (render: Render, opts?: HandlerOptions): Handler => async (ctx: RequestContext) => {
  const HTML = await render(ctx)   
  const hashString = await crypto.hash(HTML)

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "ETag": hashString
  })
  if (opts?.headers) mergeHeaders(headers, opts.headers)

  return new Response(HTML, { headers })
}