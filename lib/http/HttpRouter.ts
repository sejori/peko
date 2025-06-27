import { RequestContext } from "../core/context.ts";
import { Middleware, Handler } from "../core/types.ts";
import { Route, Router, RouteConfig, AddRouteOverloads } from "../core/Router.ts";
import { DefaultState } from "../core/context.ts";

export interface HttpRouteConfig<S extends DefaultState = DefaultState> extends RouteConfig<S> {
  path: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: Handler<S>;
}

export class HttpRoute<S extends DefaultState = DefaultState> extends Route<S> {
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
  S extends DefaultState = DefaultState,
  Config extends HttpRouteConfig<S> = HttpRouteConfig<S>,
  R extends HttpRoute<S> = HttpRoute<S>
> extends Router<S, Config, R> {
  override Route = HttpRoute<S>;

  constructor(
    public override state?: S, 
    public override middleware: Middleware<S>[] = [], 
    public override routes: Record<string, R> = {}
  ) {
    super(state, middleware, routes);
  }

  private createMethod(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") {
    return (
        arg1: Config | Config["path"],
        arg2?: Middleware<S> | Middleware<S>[] | Omit<Config, "path"> | Handler<S>,
        arg3?: Handler<S>
    ): R => {
      // deno-lint-ignore no-explicit-any
        const newRoute = this.addRoute(arg1 as any, arg2 as any, arg3 as any);
        newRoute.method = method;
        return newRoute;
    };
  }

  GET = this.createMethod("GET") as AddRouteOverloads<S, Config, R>;
  POST = this.createMethod("POST") as AddRouteOverloads<S, Config, R>;
  PUT = this.createMethod("PUT") as AddRouteOverloads<S, Config, R>;
  PATCH = this.createMethod("PATCH") as AddRouteOverloads<S, Config, R>;
  DELETE = this.createMethod("DELETE") as AddRouteOverloads<S, Config, R>;
}

const test = new HttpRouter();
test.GET('/test', () => new Response("GET response"));
