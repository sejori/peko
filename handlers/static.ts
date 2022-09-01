import { RequestContext, Handler } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"

const crypto = new Crypto(Array.from({length: 10}, () => Math.floor(Math.random() * 9)).toString())

export type StaticData = { 
  fileURL: URL
  contentType: string | undefined
  headers?: Headers
}

/**
 * Generates Response with body from file URL, sets modifiable
 * "Cache-Control" header and hashes file contents for "ETAG" header.
 * @param staticData: StaticData
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const staticHandler = (staticData: StaticData): Handler => async (_ctx: RequestContext) => {
  let filePath = decodeURI(staticData.fileURL.pathname)
  
  // fix annoying windows paths
  if (Deno.build.os === "windows") filePath = filePath.substring(1)

  // Is it more efficient to stream file into response body?
  const body = await Deno.readFile(filePath)
  const hashString = await crypto.hash(body.toString())

  const headers = new Headers({
    "ETag": hashString,
    "Content-Type": staticData.contentType ? staticData.contentType : "text/plain",
  })

  if (staticData.headers) {
    for (const pair of staticData.headers.entries()) {
      headers.append(pair[0], pair[1])
    }
  }

  return new Response(body, { headers })
}