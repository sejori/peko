import type { RequestContext, Middleware, Handler, CombineMiddlewareStates, DefaultState } from "../core/types.ts";
import { Route, Router, type RouteConfig } from "../core/utils/Router.ts";

export interface HttpRouteConfig<S extends DefaultState = DefaultState> extends RouteConfig<S> {
  path: `/${string}`;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  handler: Handler<S>;
}

export class HttpRoute<
  S extends DefaultState = DefaultState,
  Config extends HttpRouteConfig<S> = HttpRouteConfig<S>
> extends Route<S> {
  declare path: `/${string}`;

  constructor(routeObj: Config) {
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
  const escaped = this.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(
    /:(\w+)/g,
    (_, paramName) => `(?<${paramName}>[^/]+)`
  );

  return new RegExp(`^${pattern}/?$`);
}

  override match(ctx: RequestContext<S>): boolean {
    const match = this.regexPath.exec(ctx.url.pathname);
    
    if (match && this.method === ctx.request.method) {
      if (match.groups) {
        Object.assign(ctx.params, match.groups);
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
  override Route: new (routeObj: Config) => R = HttpRoute as new (routeObj: Config) => R;

  constructor(
    public override middleware: Middleware<S>[] = [], 
    public override state?: S, 
    public override routes: Record<string, R> = {}
  ) {
    super(middleware, state, routes);
  }

  GET(path: Config["path"], middleware: Handler<S>): R;
  GET<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M],
    handler: Handler<CombineMiddlewareStates<M>>
  ): R
  GET<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M] | Handler<S>,
    handler?: Handler<CombineMiddlewareStates<M>>
  ): R {
    return this.addRoute({
      method: "GET",
      path,
      middleware: handler ? middleware : [],
      handler: handler ? handler : middleware,
    } as unknown as Config);
  };

  POST(path: Config["path"], middleware: Handler<S>): R;
  POST<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M],
    handler: Handler<CombineMiddlewareStates<M>>
  ): R
  POST<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M] | Handler<S>,
    handler?: Handler<CombineMiddlewareStates<M>>
  ): R {
    return this.addRoute({
      method: "POST",
      path,
      middleware: handler ? middleware : [],
      handler: handler ? handler : middleware,
    } as unknown as Config);
  };

  PUT(path: Config["path"], middleware: Handler<S>): R;
  PUT<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M],
    handler: Handler<CombineMiddlewareStates<M>>
  ): R
  PUT<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M] | Handler<S>,
    handler?: Handler<CombineMiddlewareStates<M>>
  ): R {
    return this.addRoute({
      method: "PUT",
      path,
      middleware: handler ? middleware : [],
      handler: handler ? handler : middleware,
    } as unknown as Config);
  };

  PATCH(path: Config["path"], middleware: Handler<S>): R;
  PATCH<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M],
    handler: Handler<CombineMiddlewareStates<M>>
  ): R
  PATCH<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M] | Handler<S>,
    handler?: Handler<CombineMiddlewareStates<M>>
  ): R {
    return this.addRoute({
      method: "PATCH",
      path,
      middleware: handler ? middleware : [],
      handler: handler ? handler : middleware,
    } as unknown as Config);
  };

  DELETE(path: Config["path"], middleware: Handler<S>): R;
  DELETE<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M],
    handler: Handler<CombineMiddlewareStates<M>>
  ): R
  DELETE<M extends Middleware[]>(
    path: Config["path"],
    middleware: [...M] | Handler<S>,
    handler?: Handler<CombineMiddlewareStates<M>>
  ): R {
    return this.addRoute({
      method: "DELETE",
      path,
      middleware: handler ? middleware : [],
      handler: handler ? handler : middleware,
    } as unknown as Config);
  };
}

export function HttpRouterFactory<
  M extends Middleware[] = []
>(
  opts: {
    middleware?: [...M];
    state?: CombineMiddlewareStates<M>;
  } = {}
) {
  return class extends HttpRouter<CombineMiddlewareStates<M>> {
    constructor() {
      super(
        opts.middleware as unknown as  Middleware<CombineMiddlewareStates<M>>[] || [],
        opts.state
      );
    }
  };
}
