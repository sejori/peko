import { Middleware, Handler, RequestContext } from "../types.ts";
import { Route, Router, RouteConfig } from "./_router.ts";

export interface HttpRouteConfig extends RouteConfig {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: Handler;
}

export class HttpRoute extends Route {
  declare path: `/${string}`;
  declare method: HttpRouteConfig["method"];

  constructor(routeObj: HttpRouteConfig) {
    super(routeObj);
    this.method = routeObj.method || "GET";
  }

  get params() {
    const x: Record<string, number> = {};
    this.path.split("/").forEach((str, i) => {
      if (str[0] === ":") x[str.slice(1)] = i;
    });
    return x;
  }

  get regexPath() {
    return this.params
      ? new RegExp(
          `^${this.path.replaceAll(/(?<=\/):(.)*?(?=\/|$)/g, "(.)*")}\/?$`
        )
      : new RegExp(`^${this.path}\/?$`);
  }

  match(ctx: RequestContext): boolean {
    if (
      this.regexPath.test(ctx.url.pathname) &&
      this.method === ctx.request.method
    ) {
      const pathBits = ctx.url.pathname.split("/");
      for (const param in this.params) {
        ctx.params[param] = pathBits[this.params[param]];
      }
      return true;
    }
    return false;
  }
}

export class HttpRouter extends Router {
  constructor(
    public routes: HttpRoute[] = [],
    public middleware: Middleware[] = []
  ) {
    super();
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
}
export { RequestContext };
