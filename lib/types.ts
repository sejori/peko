import { RequestContext } from "./Router.ts";

export interface Route {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  middleware?: Middleware[] | Middleware;
  handler: Handler;
}

export type Middleware = (
  ctx: RequestContext,
  next: Next
) => Promise<unknown> | unknown;
export type Next = () => Promise<Result> | Result;
export type Result = void | Response | undefined;

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
