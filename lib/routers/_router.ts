import { Handler, Middleware, RequestContext } from "../types.ts";
import { Cascade } from "../utils/Cascade.ts";

export interface RouteConfig {
  path: string;
  middleware?: Middleware | Middleware[];
  handler: Handler;
}

export class Route {
  path: string;
  middleware: Middleware[];
  handler: Handler;

  constructor(routeObj: RouteConfig) {
    this.path = routeObj.path;
    this.handler = Cascade.promisify(routeObj.handler!) as Handler;
    this.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!));
  }

  get regexPath() {
    return new RegExp(this.path);
  }

  match(ctx: RequestContext): boolean {
    return this.regexPath.test(ctx.url.pathname);
  }
}

export class Router<Config extends RouteConfig = RouteConfig, R extends Route = Route> {
  Route = Route;

  constructor(
    public routes: R[] = [], // <- use this as a hashmap for routes
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
  addRoute(route: Config): R;
  addRoute(route: Config["path"], data: Handler): R;
  addRoute(
    route: Config["path"],
    middleware: Middleware | Middleware[],
    handler: Handler
  ): R;
  addRoute(
    arg1: Config | Config["path"],
    arg2?: Middleware | Middleware[],
    arg3?: Handler
  ): R {
    // overload resolution
    const routeObj =
      typeof arg1 !== "string"
        ? arg1
        : arguments.length === 2
        ? { path: arg1, handler: arg2 as Handler }
        : {
            path: arg1,
            middleware: arg2 as Middleware | Middleware[],
            handler: arg3 as Handler,
          };

    // create new Route object
    const fullRoute = new this.Route(routeObj);

    // check if route already exists
    if (
      this.routes.find(
        (existing) =>
          existing.regexPath.toString() === fullRoute.regexPath.toString()
      )
    ) {
      throw new Error(`Route with path ${routeObj.path} already exists!`);
    }

    // add route to appropriate routes and middleware
    this.routes.push(fullRoute as R);
    this.middleware.push(function RouteMiddleware(ctx) {
      if (fullRoute.match(ctx)) {
        return new Cascade(ctx, [
          ...fullRoute.middleware,
          fullRoute.handler,
        ]).run();
      }
    });

    return fullRoute as R;
  }

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
   * @returns Route - removed route
   */
  removeRoute(route: R["path"]): R | undefined {
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
  removeRoutes(routes: R["path"][]): Array<R | undefined> {
    return routes.map((route) => this.removeRoute(route));
  }
}
