import { Cascade } from "../utils/Cascade.ts";
import {
  Middleware,
  Handler,
  BaseRoute,
  BaseRouteConfig,
  RequestContext,
} from "../types.ts";

export interface GraphRouteConfig extends BaseRouteConfig {
  method?: "QUERY" | "MUTATION" | "RESOLVER";
}

export class GraphRoute implements BaseRoute {
  path: string;
  params: Record<string, number> = {};
  regexPath: RegExp;
  method: "QUERY" | "MUTATION" | "RESOLVER";
  middleware: Middleware[] = [];
  handler: Handler;

  constructor(routeObj: GraphRouteConfig) {
    this.path = routeObj.path;
    this.regexPath = new RegExp(`^${this.path}$`);
    this.method = (routeObj.method as GraphRoute["method"]) || "QUERY";
    this.handler = Cascade.promisify(routeObj.handler!) as Handler;
    this.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!));
  }
}

export class GraphRouter {
  constructor(
    public routes: GraphRoute[] = [],
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
  addRoute(route: GraphRouteConfig): GraphRoute;
  addRoute(route: GraphRouteConfig["path"], data: Handler): GraphRoute;
  addRoute(
    route: GraphRouteConfig["path"],
    middleware: Middleware | Middleware[],
    handler: Handler
  ): GraphRoute;
  addRoute(
    arg1: GraphRouteConfig | GraphRouteConfig["path"],
    arg2?: Middleware | Middleware[],
    arg3?: Handler
  ): GraphRoute {
    // overload resolution
    const routeObj: GraphRouteConfig =
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
    const fullRoute = new GraphRoute(routeObj as GraphRouteConfig);

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
   * Add Routes
   * @param routes: Route[] - middleware can be Middlewares or Middleware
   * @returns Route[] - added routes
   */
  addRoutes(routes: GraphRouteConfig[]): GraphRoute[] {
    return routes.map((route) => this.addRoute(route));
  }

  /**
   * Remove Route from Peko server
   * @param route: Route["path"] of route to remove
   * @returns Route - removed route
   */
  removeRoute(route: GraphRouteConfig["path"]): GraphRoute | undefined {
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
  removeRoutes(routes: GraphRouteConfig["path"][]): Array<GraphRoute | undefined> {
    return routes.map((route) => this.removeRoute(route));
  }
}
