import { RequestContext } from "./context.ts";

export type Result = void | Response | undefined;
export type Next = () => Promise<Result> | Result;

export type Middleware = (
  ctx: RequestContext,
  next: Next
) => Promise<Result> | Result;
export type Handler = (ctx: RequestContext) => Promise<Response> | Response;
export type HandlerOptions = { headers?: Headers };

export type BodyInit =
  | string
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | null;
