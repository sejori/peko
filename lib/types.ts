import { Router } from "./routers/_router.ts";

export class RequestContext<T extends object = Record<string, unknown>> {
  url: URL;
  state: T;
  params: Record<string, string> = {};

  constructor(public router: Router, public request: Request, state?: T) {
    this.url = new URL(request.url);
    this.state = state ? state : ({} as T);
  }
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
