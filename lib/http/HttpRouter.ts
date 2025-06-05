import { RequestContext } from "../core/context.ts";
import { Middleware, Handler } from "../core/types.ts";
import { BaseRoute, BaseRouter, BaseRouteConfig } from "../core/BaseRouter.ts";
import { BaseState } from "../core/context.ts";

export interface HttpRouteConfig<S extends BaseState = BaseState> extends BaseRouteConfig<S> {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: Handler<S>;
}

export class HttpRoute<S extends BaseState = BaseState> extends BaseRoute<S> {
  declare path: `/${string}`;
  declare method: HttpRouteConfig<S>["method"];

  constructor(routeObj: HttpRouteConfig<S>) {
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

  override get regexPath() {
    return this.params
      ? new RegExp(
          `^${this.path.replaceAll(/(?<=\/):(.)*?(?=\/|$)/g, "(.)*")}\/?$`
        )
      : new RegExp(`^${this.path}\/?$`);
  }

  override match(ctx: RequestContext<S>): boolean {
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
  S extends BaseState = BaseState,
  Config extends HttpRouteConfig<S> = HttpRouteConfig<S>,
  R extends HttpRoute<S> = HttpRoute<S>
> extends BaseRouter<S, Config, R> {
  override Route = HttpRoute<S>;

  constructor(
    public override state?: S, 
    public override middleware: Middleware<S>[] = [], 
    public override routes: R[] = []
  ) {
    super(state, middleware, routes);
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
