import { RequestContext, Handler } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

// random crypto just for ETag generation
const crypto = new Crypto(Array.from({length: 10}, () => Math.floor(Math.random() * 9)).toString())

export type SSRData = { 
  render: Render
  headers?: Headers
}
export type Render = (ctx: RequestContext) => string | Promise<string>

/**
 * Generates Response with SSRData.render result in body 
 * Sets headers "Content-Type" and "ETag" to "text/html" and bodyHash
 * @param ssrData: SSRData
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssrHandler = (ssrData: SSRData): Handler => async (ctx: RequestContext) => {
  const HTML = await ssrData.render(ctx)   
  const hashString = await crypto.hash(HTML)

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "ETag": hashString
  })

  if (ssrData.headers) {
    for (const pair of ssrData.headers.entries()) {
      headers.append(pair[0], pair[1])
    }
  }

  return new Response(HTML, { headers })
}