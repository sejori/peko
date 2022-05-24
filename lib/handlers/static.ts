import { StaticRoute } from "../types.ts"
import { hasher } from "../utils/hasher.ts"

// I think there is a much more efficient method by streaming the file into the response body?

/**
 * Static asset request handler
 * 
 * @param staticData: StaticRoute
 * @returns Promise<Response>
 */
export const staticHandler = async (staticData: StaticRoute) => {
  let filePath = decodeURI(staticData.fileURL.pathname)
  
  // fix annoying windows paths
  if (Deno.build.os === "windows") filePath = filePath.substring(1)

  const body = await Deno.readFile(filePath)
  const hashString = hasher(body.toString())

  return new Response(body, {
    headers: new Headers({
      'Content-Type': staticData.contentType ? staticData.contentType : 'text/plain',
      'Cache-Control': 'public, max-age=31536000',
      // create hash for ETag
      // this lets browser check if file has changed by returning ETag in "if-none-match" header.
      // devMode: new ETag in each response so no browser caching
      // not devMode + memoized: ETag matches "if-none-match" header so 304 (not modified) response given
      'ETag': hashString
    })
  })
}