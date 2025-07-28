import { CombineMiddlewareStates, Handler, Middleware } from "../core/types.ts";
import { Route, Router, RouteConfig } from "../core/Router.ts";
import { Model } from "../core/utils/Model.ts";
import { QueryState } from "./middleware/parseQuery.ts";
import { graphHandler } from "./handler/graphHandler.ts";
import { RequestContext } from "../core/context.ts";
import { QueryOperation } from "./utils/QueryParser.ts";

export type Resolver<
  S extends QueryState = QueryState,
  M extends Model | Model[] = Model | Model[]
> = (ctx: RequestContext<S>) => Promise<M> | M;

export interface GraphRouteConfig<
  S extends QueryState = QueryState,
  M extends Model | Model[] = Model | Model[]
> extends RouteConfig<S> {
  method: QueryOperation["type"];
  resolver: Resolver<S, M>;
}

export class GraphRoute<
  S extends QueryState = QueryState,
  M extends Model | Model[] = Model | Model[],
  Config extends GraphRouteConfig<S, M> = GraphRouteConfig<S, M>
> extends Route<S, Config> {
  constructor(routeObj: Config) {
    super(routeObj);
  }

  override match(ctx: RequestContext<S>): boolean {
    // first match by operation type (assume parseQuery middleware has ran)
    if (ctx.state.query.operation.type === this.method) {
      // now loop root fields to match route path (operation name) against AST key (original, not alias)
      for (const key in ctx.state.query.ast) {
        if (ctx.state.query.ast[key]?.ref === this.path) {
          // found match, add final middleware to create resolver promise in queryResult data for key
          this.middleware.push((ctx) => {
            ctx.state.queryResult.data[key] = this.config.resolver(ctx) as Promise<Model>;
          });
          return true;
        }
      }
    }

    return false;
  }
}

export class GraphRouter<
  S extends QueryState,
  Config extends GraphRouteConfig<S, Model> = GraphRouteConfig<S, Model>,
  R extends Route<S, Config> = GraphRoute<S, Model, Config> 
> extends Router<S, Config, R> {
  override Route: new (routeObj: Config) => R = GraphRoute as new (routeObj: Config) => R;
  override defaultHandler: Handler<S> = graphHandler

  constructor(
    middleware: Middleware<S>[] = [], 
    state?: S, 
    routes: Record<string, R> = {}
  ) {
    super(
      middleware, 
      state, 
      routes
    );
  }

  query(operation: Config["path"], resolver: Resolver<S, Model | Model[]>): R;
  query<M extends Middleware[]>(
    operation: Config["path"],
    middleware: [...M],
    resolver: Resolver<CombineMiddlewareStates<M, QueryState>, Model | Model[]>
  ): R
  query<M extends Middleware[]>(
    operation: Config["path"],
    middleware: [...M] | Resolver<S, Model | Model[]>,
    resolver?: Resolver<CombineMiddlewareStates<M, QueryState>, Model | Model[]>
  ): R {
    return this.addRoute({
      method: "QUERY",
      path: operation,
      middleware: resolver ? (middleware as unknown as Middleware): [],
      resolver: resolver ? resolver : middleware,
    });
  };

  mutation(operation: Config["path"], resolver: Resolver<S, Model | Model[]>): R;
  mutation<M extends Middleware[]>(
    operation: Config["path"],
    middleware: [...M],
    resolver: Resolver<CombineMiddlewareStates<M, QueryState>, Model | Model[]>
  ): R
  mutation<M extends Middleware[]>(
    operation: Config["path"],
    middleware: [...M] | Resolver<S, Model | Model[]>,
    resolver?: Resolver<CombineMiddlewareStates<M, QueryState>, Model | Model[]>
  ): R {
    return this.addRoute({
      method: "MUTATION",
      path: operation,
      middleware: resolver ? (middleware as unknown as Middleware): [],
      resolver: resolver ? resolver : middleware,
    });
  };

  subscription(operation: Config["path"], resolver: Resolver<S, Model | Model[]>): R;
  subscription<M extends Middleware[]>(
    operation: Config["path"],
    middleware: [...M],
    resolver: Resolver<CombineMiddlewareStates<M, QueryState>, Model | Model[]>
  ): R
  subscription<M extends Middleware[]>(
    operation: Config["path"],
    middleware: [...M] | Resolver<S, Model | Model[]>,
    resolver?: Resolver<CombineMiddlewareStates<M, QueryState>, Model | Model[]>
  ): R {
    return this.addRoute({
      method: "SUBSCRIPTION",
      path: operation,
      middleware: resolver ? (middleware as unknown as Middleware): [],
      resolver: resolver ? resolver : middleware,
    });
  };
}

export function GraphRouterFactory<
  M extends Middleware[] = []
>(
  opts: {
    middleware?: [...M];
    state?: CombineMiddlewareStates<M>;
  } = {}
) {
  return class extends GraphRouter<CombineMiddlewareStates<M>> {
    constructor() {
      super(
        opts.middleware as unknown as  Middleware<CombineMiddlewareStates<M>>[] || [],
        opts.state
      );
    }
  };
}