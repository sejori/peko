import { RequestContext, Handler } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

const crypto = new Crypto(Array.from({length: 10}, () => Math.floor(Math.random() * 9)).toString())

export type SSRData = { 
  srcURL?: URL
  render: Render
  cacheControl?: string
}
export type Render = (ctx: RequestContext) => string | Promise<string>

/**
 * Generates Response with SSRData.render result in body, sets modifiable 
 * "Cache-Control" header and hashes render output for "ETAG" header
 * @param ssrData: SSRData
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const ssrHandler = (ssrData: SSRData): Handler => async (ctx: RequestContext) => {
  // TODO: emit srcURL file change events from watcher worker (in devMode)

  // use provided render and template fcns for HTML generation
  const HTML = await ssrData.render(ctx)   
  const hashString = await crypto.hash(HTML)

  return new Response(HTML, {
    headers : new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      // tell browser not to cache if in devMode
      'Cache-Control': ctx.server.config.devMode
        ? 'no-store'
        : ssrData.cacheControl ? ssrData.cacheControl : 'max-age=604800, stale-while-revalidate=86400',
      // create ETag hash so 304 (not modified) response can be given from cacher
      'ETag': hashString
    })
  })
}

// TODO: test angle bracket HTMLContent returned from render