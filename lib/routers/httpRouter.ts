import { Cascade } from "../utils/Cascade.ts";
import {
  Middleware,
  Handler,
  BaseRouter,
  BaseRoute,
  RequestContext,
} from "../types.ts";

export interface HttpRouteConfig extends Partial<BaseRoute> {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: Handler;
}

export class HttpRoute implements BaseRoute {
  path: `/${string}`;
  regexPath: RegExp;
  middleware: Middleware[] = [];
  handler: Handler;
  params: Record<string, number> = {};
  method: "GET" | "POST" | "PUT" | "DELETE";

  constructor(routeObj: HttpRouteConfig) {
    this.path =
      routeObj.path[routeObj.path.length - 1] === "/"
        ? (routeObj.path.slice(0, -1) as HttpRoute["path"])
        : (routeObj.path as HttpRoute["path"]);

    this.path.split("/").forEach((str, i) => {
      if (str[0] === ":") this.params[str.slice(1)] = i;
    });

    this.regexPath = this.params
      ? new RegExp(
          `^${this.path.replaceAll(/(?<=\/):(.)*?(?=\/|$)/g, "(.)*")}\/?$`
        )
      : new RegExp(`^${this.path}\/?$`);

    this.method = (routeObj.method as HttpRoute["method"]) || "GET";
    this.handler = Cascade.promisify(routeObj.handler!) as Handler;
    this.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!));
  }
}

export class HttpRouter implements BaseRouter {
  constructor(
    public routes: HttpRoute[] = [],
    public middleware: Middleware[] = []
  ) {}

  async handle(request: Request): Promise<Response> {
    const ctx = new RequestContext(this, request);
    const res = await new Cascade(ctx, this.middleware).run();
    return res ? res : new Response("", { status: 404 });
  }

  use(middleware: Middleware | Middleware[]) {
    if (Array.isArray(middleware)) {
      middleware.forEach((mware) => this.use(mware));
    } else {
      this.middleware.push(Cascade.promisify(middleware));
    }
    return this;
  }

  addRoute(route: HttpRouteConfig): HttpRoute;
  addRoute(route: HttpRouteConfig["path"], data: Handler): HttpRoute;
  addRoute(
    route: HttpRouteConfig["path"],
    middleware: Middleware | Middleware[],
    handler: Handler
  ): HttpRoute;
  addRoute(
    arg1: HttpRouteConfig | HttpRoute["path"],
    arg2?: Middleware | Middleware[],
    arg3?: Handler
  ): HttpRoute {
    // overload resolution
    const routeObj: HttpRouteConfig =
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
    const fullRoute = new HttpRoute(routeObj);

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

  get: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "GET";
    return newRoute;
  };

  post: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "POST";
    return newRoute;
  };

  put: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "PUT";
    return newRoute;
  };

  delete: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "DELETE";
    return newRoute;
  };

  addRoutes(routes: HttpRouteConfig[]): HttpRoute[] {
    return routes.map((route) => this.addRoute(route));
  }

  removeRoute(route: HttpRoute["path"]): HttpRoute | undefined {
    const routeToRemove = this.routes.find((r) => r.path === route);
    if (routeToRemove) {
      this.routes.splice(this.routes.indexOf(routeToRemove), 1);
    }

    return routeToRemove;
  }

  removeRoutes(routes: HttpRoute["path"][]): Array<HttpRoute | undefined> {
    return routes.map((route) => this.removeRoute(route));
  }
}
export { RequestContext };

