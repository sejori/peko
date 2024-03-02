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
  fetchHeaders?: Headers;
  headers?: Headers;
  transform?: (
    contents: ReadableStream<Uint8Array>
  ) => Promise<BodyInit> | BodyInit;
}

/**
 * Responds Response body from file URL with ETAG header.
 * Optionally: provide custom headers and/or body transform fcn.
 *
 * @param fileUrl: URL object of file address
 * @param opts: (optional) staticHandlerOptions
 * @returns Handler: (ctx: RequestContext) => Promise<Response>
 */
export const staticFiles = async (
  fileUrl: URL,
  opts: staticHandlerOptions = {}
): Promise<Handler> => {
  const hashString = await crypto.hash(fileUrl.toString());
  const transform = opts.transform
    ? opts.transform
    : (body: ReadableStream<Uint8Array>) => body;

  const { body, headers } = await fetch(fileUrl, {
    headers: opts.fetchHeaders,
  });

  const response = new Response(body ? await transform(body) : null, {
    headers: mergeHeaders(
      new Headers({
        ...Object.fromEntries(opts?.headers?.entries() || []),
        ETag: hashString,
      }),
      headers
    ),
  });

  return function staticHandler(_ctx: RequestContext) {
    return response;
  };
};
