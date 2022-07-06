import { RequestContext } from "../server.ts"
import { hasher } from "../utils/hash.ts"

export type StaticData = { 
  fileURL: URL
  contentType: string | undefined
}

/**
 * Peko static asset handler. Generates "Cache-Control" and "ETAG" headers.
 * @param staticData: StaticData
 * @returns Promise<Response>
 */
export const staticHandler = async (ctx: RequestContext, staticData: StaticData) => {
  let filePath = decodeURI(staticData.fileURL.pathname)
  
  // fix annoying windows paths
  if (Deno.build.os === "windows") filePath = filePath.substring(1)

  // Is it more efficient to stream file into response body?
  const body = await Deno.readFile(filePath)
  const hashString = await hasher(body.toString())

  return new Response(body, {
    headers: new Headers({
      'Content-Type': staticData.contentType ? staticData.contentType : 'text/plain',
      // tell browser not to cache if in devMode
      'Cache-Control': ctx.peko.config.devMode
        ? 'no-store'
        : 'max-age=604800, stale-while-revalidate=86400',
      // create ETag hash so 304 (not modified) response can be given from cacher
      'ETag': hashString
    })
  })
}