import { contentType } from "https://deno.land/std@0.174.0/media_types/mod.ts";
import { RequestContext, Handler, HandlerOptions } from "../types.ts"
import { Crypto } from "../utils/Crypto.ts"
import { mergeHeaders } from "../utils/helpers.ts";

const crypto = new Crypto(Array.from({length: 10}, () => Math.floor(Math.random() * 9)).toString())
export interface staticHandlerOptions extends HandlerOptions {
  transform?: (contents: Uint8Array) => Promise<BodyInit> | BodyInit
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
  const filePath = decodeURI(fileURL.pathname)

  const body = await Deno.readFile(filePath)
  const hashString = await crypto.hash(body.toString())
  const ctHeader = contentType(filePath.slice(filePath.lastIndexOf(".")))

  const headers = new Headers({
    "ETag": hashString,
    "Content-Type": ctHeader ? ctHeader : "text/plain"
  })

  if (opts.headers) mergeHeaders(headers, opts.headers)
  if (opts.transform) return new Response(await opts.transform(body), { headers })

  return new Response(body, { headers })
}