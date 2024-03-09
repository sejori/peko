import { Crypto } from "../utils/Crypto.ts";
import { mergeHeaders } from "../utils/helpers.ts";
import { Handler, HandlerOptions, BodyInit } from "../types.ts";

export interface staticHandlerOptions extends HandlerOptions {
  crypto?: Crypto;
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
export const file = async (
  fileUrl: URL,
  opts: staticHandlerOptions = {}
): Promise<Handler> => {
  const pekoCrypto = opts?.crypto || new Crypto("peko_static");
  const hashString = await pekoCrypto.hash(fileUrl.toString());
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

  return function staticHandler() {
    return response;
  };
};
