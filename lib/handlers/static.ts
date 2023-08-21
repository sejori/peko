import { readFile } from "node:fs/promises"
import { contentType } from "https://deno.land/std@0.198.0/media_types/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.198.0/path/mod.ts"
import { RequestContext } from "../Router.ts"
import { Crypto } from "../utils/Crypto.ts"
import { mergeHeaders } from "../utils/helpers.ts"
import { Handler, HandlerOptions, BodyInit } from "../types.ts"

const crypto = new Crypto(Array.from({length: 10}, () => {
  return Math.floor(Math.random() * 9)
}).toString())

export interface staticHandlerOptions extends HandlerOptions {
  transform?: (contents: ArrayBuffer) => Promise<BodyInit> | BodyInit
}

/**
 * Generates Response body from file URL and Content-Type and ETAG headers.
 * Optionally: provide custom headers and/or body transform fcn.
 * 
 * @param fileURL: URL object of file address
 * @param opts: (optional) staticHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const staticFiles = (fileURL: URL, opts: staticHandlerOptions = {}): Handler => {
  return async function staticHandler (_ctx: RequestContext) {
    const filePath = decodeURI(fileURL.pathname)

    const body = await readFile(fromFileUrl(fileURL))
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
}