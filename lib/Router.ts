import { Cascade } from "./utils/Cascade.ts";
import { Middleware, Handler, Route } from "./types.ts";

export class RequestContext<T extends object = Record<string, unknown>> {
  url: URL;
  state: T;
  params: Record<string, string> = {};

  constructor(public router: Router, public request: Request, state?: T) {
    this.url = new URL(request.url);
    this.state = state ? state : ({} as T);
  }
}

export class _Route implements Route {
  path: `/${string}`;
  params: Record<string, number> = {};
  regexPath: RegExp;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  middleware: Middleware[] = [];
  handler: Handler;

  constructor(routeObj: Route) {
    if (!routeObj.path) throw new Error("Route is missing path");
    if (!routeObj.handler) throw new Error("Route is missing handler");

    this.path =
      routeObj.path[routeObj.path.length - 1] === "/"
        ? (routeObj.path.slice(0, -1) as Route["path"])
        : routeObj.path;

    this.path.split("/").forEach((str, i) => {
      if (str[0] === ":") this.params[str.slice(1)] = i;
    });

    this.regexPath = this.params
      ? new RegExp(
          `^${this.path.replaceAll(/(?<=\/):(.)*?(?=\/|$)/g, "(.)*")}\/?$`
        )
      : new RegExp(`^${this.path}\/?$`);

    this.method = routeObj.method || "GET";
    this.handler = Cascade.promisify(routeObj.handler!) as Handler;
    this.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!));
  }
}

export class Router {
  constructor(
    public routes: _Route[] = [],
    public middleware: Middleware[] = []
  ) {}

  /**
   * Running Request through middleware cascade for Response.
   * @param request: Request
   * @returns Promise<Response>
   */
  async handle(request: Request): Promise<Response> {
    const ctx = new RequestContext(this, request);
    const res = await new Cascade(ctx, this.middleware).run();
    return res ? res : new Response("", { status: 404 });
  }

  /**
   * Add global middleware or another router's middleware
   * @param middleware: Middleware[] | Middleware | Router
   * @returns number - server.middleware.length
   */
  use(middleware: Middleware | Middleware[]) {
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
  addRoute(route: Route): Route;
  addRoute(route: Route["path"], data: Handler | Partial<Route>): Route;
  addRoute(
    route: Route["path"],
    middleware: Middleware | Middleware[],
    handler: Handler
  ): Route;
  addRoute(
    arg1: Route | Route["path"],
    arg2?: Partial<Route> | Middleware | Middleware[],
    arg3?: Handler
  ): Route {
    const routeObj: Partial<Route> =
      typeof arg1 !== "string"
        ? arg1
        : arguments.length === 2
        ? typeof arg2 === "function"
          ? { path: arg1, handler: arg2 as Handler }
          : { path: arg1, ...(arg2 as Partial<Route>) }
        : {
            path: arg1,
            middleware: arg2 as Middleware | Middleware[],
            handler: arg3,
          };

    const fullRoute = new _Route(routeObj as Route);

    if (
      this.routes.find(
        (existing) =>
          existing.regexPath.toString() === fullRoute.regexPath.toString()
      )
    ) {
      throw new Error(`Route with path ${routeObj.path} already exists!`);
    }

    this.routes.push(fullRoute);
    this.middleware.push(function RouteMiddleware(ctx) {
      if (
        fullRoute.regexPath.test(ctx.url.pathname) &&
        fullRoute.method === ctx.request.method
      ) {
        if (fullRoute?.params) {
          const pathBits = ctx.url.pathname.split("/");
          for (const param in fullRoute.params) {
            ctx.params[param] = pathBits[fullRoute.params[param]];
          }
        }

        return new Cascade(ctx, [
          ...fullRoute.middleware,
          fullRoute.handler,
        ]).run();
      }
    });

    return fullRoute;
  }
  /**
   * Add Route with method "GET" (same as default addRoute behaviour)
   * @returns route: Route - added route object
   */
  get: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "GET";
    return newRoute;
  };

  /**
   * Add Route with method "POST"
   * @returns route: Route - added route object
   */
  post: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "POST";
    return newRoute;
  };

  /**
   * Add Route with method "PUT"
   * @returns route: Route - added route object
   */
  put: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "PUT";
    return newRoute;
  };

  /**
   * Add Route with method "DELETE"
   * @returns route: Route - added route object
   */
  delete: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "DELETE";
    return newRoute;
  };

  /**
   * Add Routes
   * @param routes: Route[] - middleware can be Middlewares or Middleware
   * @returns Route[] - added routes
   */
  addRoutes(routes: Route[]): Route[] {
    return routes.map((route) => this.addRoute(route));
  }

  /**
   * Remove Route from Peko server
   * @param route: Route["path"] of route to remove
   * @returns Route - removed route
   */
  removeRoute(route: Route["path"]): Route | undefined {
    const routeToRemove = this.routes.find((r) => r.path === route);
    if (routeToRemove) {
      this.routes.splice(this.routes.indexOf(routeToRemove), 1);
    }

    return routeToRemove;
  }

  /**
   * Remove Routes
   * @param routes: Route["path"] of routes to remove
   * @returns Array<Route | undefined> - removed routes
   */
  removeRoutes(routes: Route["path"][]): Array<Route | undefined> {
    return routes.map((route) => this.removeRoute(route));
  }
}

export default Router;
