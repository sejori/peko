import { RequestContext } from "../Router.ts";
import { Crypto } from "../utils/Crypto.ts";
import { mergeHeaders } from "../utils/helpers.ts";
import { Handler, HandlerOptions, BodyInit } from "../types.ts";

const crypto = new Crypto(
  Array.from({ length: 10 }, () => {
    return Math.floor(Math.random() * 9);
  }).toString()
);

export interface staticHandlerOptions extends HandlerOptions {
  includeFetchHeaders?: boolean;
  transform?: (
    contents: ReadableStream<Uint8Array>
  ) => Promise<BodyInit> | BodyInit;
}

/**
 * Generates Response body from file URL and Content-Type and ETAG headers.
 * Optionally: provide custom headers and/or body transform fcn.
 *
 * @param fileURL: URL object of file address
 * @param opts: (optional) staticHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const staticFiles = (
  fileURL: URL,
  opts: staticHandlerOptions = {}
): Handler => {
  return async function staticHandler(_ctx: RequestContext) {
    const hashString = await crypto.hash(fileURL.toString());
    const { body, headers } = await fetch(fileURL);

    const responseHeaders = new Headers({
      ...(opts.includeFetchHeaders !== false &&
        Object.fromEntries(headers.entries())),
      ETag: hashString,
    });

    if (opts.headers) mergeHeaders(responseHeaders, opts.headers);
    if (body && opts.transform)
      return new Response(await opts.transform(body), {
        headers: responseHeaders,
      });

    return new Response(body, { headers });
  };
};
