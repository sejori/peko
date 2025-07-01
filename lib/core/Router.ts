import { DefaultState, RequestContext } from "./context.ts";
import { Handler, Middleware } from "./types.ts";
import { Cascade } from "./utils/Cascade.ts";

/**
 * RouteKey is a combination of the routes method and path.
 * It is used to uniquely identify a route in the router.
 * @example
 * const routeKey: RouteKey = "GET-/api/users";
 */
export type RouteKey = `${string}-${string}`;

// deno-lint-ignore no-explicit-any
export interface RouteConfig<S extends DefaultState = any> {
  path: string;
  method: string;
  middleware?: Middleware<S> | Middleware<S>[];
  handler?: Handler<S>;
}

export class Route<S extends DefaultState = DefaultState> {
  path: string;
  method: string;
  routeKey: RouteKey;
  middleware: Middleware<S>[];
  handler?: Handler<S>;

  constructor(routeObj: RouteConfig<S>) {
    this.path = routeObj.path;
    this.method = routeObj.method.toUpperCase();
    this.routeKey = `${this.method}-${this.path}`;
    this.handler = routeObj.handler && Cascade.promisify(routeObj.handler);
    this.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!));
  }

  get regexPath() {
    return new RegExp(this.path);
  }

  match(ctx: RequestContext<S>): boolean {
    return this.regexPath.test(ctx.url.pathname);
  }
}

export type AddRouteOverloads<S extends DefaultState, Config extends RouteConfig<S>, R extends Route<S>> = {
    (route: Config): R;
    (route: Config["path"], data: Omit<Config, "path"> | Handler<S>): R;
    (
        route: Config["path"],
        middleware: Middleware<S> | Middleware<S>[],
        handler: Handler<S>
    ): R;
};

export class Router<
  S extends DefaultState = DefaultState,
  Config extends RouteConfig<S> = RouteConfig<S>,
  R extends Route<S> = Route<S>
> {
  Route = Route<S>;

  constructor(
    public middleware: Middleware<S>[] = [],
    public state?: S,
    public routes: Record<string, R> = {}
  ) {}

  /**
   * Running Request through middleware cascade for Response.
   * @param request: Request
   * @returns Promise<Response>
   */
  public async handle(request: Request): Promise<Response> {
    const ctx = new RequestContext(request, this.state);
    const middleware = [...this.middleware];

    for (const routeKey in this.routes) {
      const route = this.routes[routeKey];
      if (route.match(ctx)) {
        middleware.push(
          ...route.middleware,
          ...(route.handler ? [route.handler] : []),
        );
      }
    }
    
    const res = await new Cascade(ctx, middleware).run();
    return res ? res : new Response("", { status: 404 });
  }

  /**
   * Add global middleware or another router's middleware
   * @param middleware: Middleware[] | Middleware | Router
   * @returns number - server.middleware.length
   */
  use(middleware: Middleware<S> | Middleware<S>[]) {
    if (Array.isArray(middleware)) {
      middleware.forEach((mware) => this.use(mware));
    } else {
      this.middleware.push(Cascade.promisify(middleware));
    }
    return this;
  }

  /**
   * Add Route
   * @param route: Route | Route["path"]
   * @param arg2?: Partial<Route> | Middleware | Middleware[],
   * @param arg3?: Handler
   * @returns route: Route - added route object
   */
  addRoute<C extends RouteConfig>(method: C): R;
  addRoute<C extends RouteConfig>(method: C["method"], path: C["path"], data: Omit<C, "path" | "method"> | Handler<S>): R;
  addRoute<C extends RouteConfig>(method: C["method"], path: C["path"], middleware: Middleware<S> | Middleware<S>[], handler: Handler<S>): R;
  addRoute<C extends RouteConfig>(
    arg1: C | C["method"],
    arg2?: C["path"],
    arg3?: Middleware<S> | Middleware<S>[] | Omit<C, "path"> | Handler<S>,
    arg4?: Handler<S>
  ): R {
    const routeObj =
      typeof arg1 !== "string"
        ? arg1
        : arg4 !== undefined
        ? {
            method: arg1,
            path: arg2 as C["path"],
            middleware: arg3 as Middleware,
            handler: arg4,
          }
        : typeof arg3 === "function"
        ? { method: arg1, path: arg2 as string, handler: arg3 as Handler }
        : { method: arg1, path: arg2 as string, ...(arg3 as Omit<C, "path" | "method">) };

    const fullRoute = new this.Route(routeObj);
    const fullRouteKey = fullRoute.routeKey;
    if (this.routes[fullRouteKey]) {
      throw new Error(`Route with key ${fullRouteKey} already exists!`);
    }

    this.routes[fullRouteKey] = fullRoute as R;
    return fullRoute as R;
  };

  /**
   * Add Routes
   * @param routes: Route[] - middleware can be Middlewares or Middleware
   * @returns Route[] - added routes
   */
  addRoutes(routes: Config[]): R[] {
    return routes.map((route) => this.addRoute(route));
  }

  /**
   * Remove Route from Peko server
   * @param route: Route["path"] of route to remove
   * @returns new length of routes
   * @description Removes a route by its path (if it exists).
   * @example
   * ```ts
   * router.removeRoute("/route");
   * ```
   */
  removeRoute(routeKey: RouteKey): number {
    delete this.routes[routeKey]
    return Object.keys(this.routes).length;
  }

  /**
   * Remove Routes
   * @param routes: Route["path"] of routes to remove
   * @returns new length of routes
   * @description Attempts to remove multiple routes by their paths.
   * @example
   * ```ts
   * router.removeRoutes(["/route1", "/route2"]);
   * ```
   */
  removeRoutes(routeKeys: RouteKey[]): number {
    routeKeys.map((key) => this.removeRoute(key));
    return Object.keys(this.routes).length;
  }
}
