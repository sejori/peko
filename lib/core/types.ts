import { DefaultState, RequestContext } from "./context.ts";

export type Result = void | Response | undefined;
export type Next = () => Promise<Result> | Result;

// deno-lint-ignore no-explicit-any
export type Middleware<S extends DefaultState = any> = (
  ctx: RequestContext<S>,
  next: Next
) => Promise<Result> | Result;

export type Handler<S extends DefaultState = DefaultState> = 
  (ctx: RequestContext<S>) => Promise<Response> | Response;
export type HandlerOptions = { headers?: Headers };

export type BodyInit =
  | string
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | null;

export type CombineMiddlewareStates<M extends Middleware[]> = 
  M extends [infer First, ...infer Rest]
    ? First extends Middleware<infer S>
      ? Rest extends Middleware[]
        ? S & CombineMiddlewareStates<Rest>
        : DefaultState
    : DefaultState
  : DefaultState;