import { RequestContext } from "../context.ts";
import { Middleware, Handler } from "../types.ts";
import { BaseRoute, BaseRouter, BaseRouteConfig } from "./_Router.ts";

export interface HttpRouteConfig extends BaseRouteConfig {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: Handler;
}

export class HttpRoute extends BaseRoute {
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

export class HttpRouter<
  Config extends HttpRouteConfig = HttpRouteConfig,
  R extends HttpRoute = HttpRoute
> extends BaseRouter<Config, R> {
  Route = HttpRoute;

  constructor(public routes: R[] = [], public middleware: Middleware[] = []) {
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
