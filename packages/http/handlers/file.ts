import { Krypto } from "../../auth/utils/Krypto.ts";
import { mergeHeaders } from "../utils/mergeHeaders.ts";
import type { Handler, HandlerOptions, BodyInit } from "../../core/types.ts";

export interface staticHandlerOptions extends HandlerOptions {
  krypto?: Krypto;
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
  const pekoCrypto = opts?.krypto || new Krypto("peko_static");
  const hashString = await pekoCrypto.hash(fileUrl.toString());
  const transform = opts.transform
    ? opts.transform
    : (body: ReadableStream<Uint8Array>) => body;

  const { body, headers } = await fetch(fileUrl, {
    headers: opts.fetchHeaders,
  });

  const response = new Response(body ? await transform(body) : null, {
    headers: mergeHeaders(
      new Headers(headers),
      new Headers({ ETag: hashString }),
      new Headers(opts.headers)
    ),
  });

  return function staticHandler() {
    return response.clone();
  };
};
