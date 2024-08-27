export interface BaseRouteConfig {
  path: string;
  method?: string;
  middleware?: Middleware | Middleware[];
  handler: Handler;
}

export interface BaseRoute {
  path: string;
  regexPath: RegExp;
  middleware: Middleware[] | Middleware;
  handler: Handler;
  method: string;
}

export interface BaseRouter {
  routes: BaseRoute[];
  middleware: Middleware[];

  /**
   * Running Request through middleware cascade for Response.
   * @param request: Request
   * @returns Promise<Response>
   */
  handle(request: Request): Promise<Response>;

  /**
   * Add global middleware or another router's middleware
   * @param middleware: Middleware[] | Middleware | Router
   * @returns number - server.middleware.length
   */
  use(middleware: Middleware | Middleware[]): void;

  /**
   * Add Route
   * @param route: Route | Route["path"]
   * @param arg2?: Partial<Route> | Middleware | Middleware[],
   * @param arg3?: Handler
   * @returns route: Route - added route object
   */
  addRoute(route: BaseRouteConfig): BaseRoute;
  addRoute(route: BaseRouteConfig["path"], data: Handler): BaseRoute;
  addRoute(
    route: BaseRouteConfig["path"],
    middleware: Middleware | Middleware[],
    handler: Handler
  ): BaseRoute;
  addRoute(
    arg1: BaseRouteConfig | BaseRouteConfig["path"],
    arg2?: Middleware | Middleware[],
    arg3?: Handler
  ): BaseRoute;

  /**
   * Add Routes
   * @param routes: Route[] - middleware can be Middlewares or Middleware
   * @returns Route[] - added routes
   */
  addRoutes(routes: BaseRouteConfig[]): BaseRoute[];

  /**
   * Remove Route from Peko server
   * @param route: Route["path"] of route to remove
   * @returns Route - removed route
   */
  removeRoute(route: BaseRoute["path"]): BaseRoute | undefined;

  /**
   * Remove Routes
   * @param routes: Route["path"] of routes to remove
   * @returns Array<Route | undefined> - removed routes
   */
  removeRoutes(routes: BaseRoute["path"][]): Array<BaseRoute | undefined>;
}

export type Result = void | Response | undefined;
export type Next = () => Promise<Result> | Result;

export type Middleware = (
  ctx: RequestContext,
  next: Next
) => Promise<Result> | Result;
export type Handler = (ctx: RequestContext) => Promise<Response> | Response;
export type HandlerOptions = { headers?: Headers };

export class RequestContext<T extends object = Record<string, unknown>> {
  url: URL;
  state: T;
  params: Record<string, string> = {};

  constructor(public router: BaseRouter, public request: Request, state?: T) {
    this.url = new URL(request.url);
    this.state = state ? state : ({} as T);
  }
}

export type BodyInit =
  | string
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | null;
