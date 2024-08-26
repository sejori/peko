import { RequestContext } from "./Router.ts";

export interface Route {
  path: string;
  method?: string;
  middleware?: Middleware[] | Middleware;
  handler: Handler;
}

export interface HttpRouteConfig extends Route {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export interface GraphRouteConfig extends Route {
  method?: "QUERY" | "MUTATION" | "RESOLVER";
}

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
