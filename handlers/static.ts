import { contentType } from "https://deno.land/std@0.162.0/media_types/mod.ts";
import { RequestContext, Handler, HandlerOptions } from "../server.ts"
import { Crypto } from "../utils/Crypto.ts"
import { mergeHeaders } from "../utils/helpers.ts";

const crypto = new Crypto(Array.from({length: 10}, () => Math.floor(Math.random() * 9)).toString())
export interface staticHandlerOptions extends HandlerOptions {
  transform?: (contents: Uint8Array) => BodyInit
}

/**
 * Generates Response body from file URL and Content-Type and ETAG headers.
 * Optionally: provide custom headers and/or body transform fcn.
 * 
 * @param fileURL: URL object of file address
 * @param opts: (optional) HandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const staticHandler = (fileURL: URL, opts: staticHandlerOptions = {}): Handler => async (_ctx: RequestContext) => {
  let filePath = decodeURI(fileURL.pathname)
  
  // fix annoying windows paths
  if (Deno.build.os === "windows") filePath = filePath.substring(1)

  const body = await Deno.readFile(filePath)
  const hashString = await crypto.hash(body.toString())
  const ctHeader = contentType(filePath.slice(filePath.lastIndexOf(".")))

  const headers = new Headers({
    "ETag": hashString,
    "Content-Type": ctHeader ? ctHeader : "text/plain"
  })

  if (opts.headers) mergeHeaders(headers, opts.headers)
  if (opts.transform) return new Response(opts.transform(body), { headers })

  return new Response(body, { headers })
}