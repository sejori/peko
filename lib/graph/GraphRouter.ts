import { CombineMiddlewareStates, Handler, Middleware } from "../core/types.ts";
import { Route, Router, RouteConfig } from "../core/Router.ts";
import { ModelInterface, ModelSchemaType } from "../core/utils/Model.ts";
import { QueryState } from "./middleware/parseQuery.ts";
import { graphHandler } from "./handler/graphHandler.ts";
import { RequestContext } from "../core/context.ts";
import { QueryOperation } from "./utils/QueryParser.ts";
import { Constructor } from "../core/utils/Field.ts";

export type Resolver<
  S extends QueryState = QueryState,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  A extends ModelInterface | undefined = ModelInterface,
> = (
  ctx: RequestContext<S>, 
  args: A extends ModelInterface ? ModelSchemaType<A["schema"]> : undefined
) => T extends Constructor[] 
  ? InstanceType<T[0]>[] | Promise<InstanceType<T[0]>>[]
  : T extends Constructor
  ? InstanceType<T> | Promise<InstanceType<T>>
  : null;

export interface GraphRouteConfig<
  S extends QueryState = QueryState,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  A extends ModelInterface | undefined = ModelInterface
> extends RouteConfig<S> {
  method: QueryOperation["type"];
  args?: A;
  type: T;
  resolver: Resolver<S, T, A>;
}

export class GraphRoute<
  // deno-lint-ignore no-explicit-any
  S extends QueryState = any,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  A extends ModelInterface = ModelInterface,
  Config extends GraphRouteConfig<S, T, A> = GraphRouteConfig<S, T, A>
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
            ctx.state.queryResult.data[key] = this.config.resolver(
              ctx, 
              (this.config.args && ctx.state.query.ast[key]?.args 
                ? new this.config.args(ctx.state.query.ast[key].args) 
                : undefined) as A extends ModelInterface ? ModelSchemaType<A["schema"]> : undefined
            ) as Promise<Constructor>;
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
  Config extends GraphRouteConfig<S, Constructor> = GraphRouteConfig<S, Constructor>,
  R extends Route<S, Config> = GraphRoute<S, Constructor, ModelInterface, Config> 
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

  query<T extends Constructor | Constructor[], M extends Middleware[], A extends ModelInterface>(
    operation: Config["path"],
    opts: {
      args?: A,
      type: T
      middleware?: M,
      resolver: Resolver<CombineMiddlewareStates<M, S>, T>
    }
  ): R {
    return this.addRoute<GraphRouteConfig<CombineMiddlewareStates<M, S>, T, A>>({
      method: "QUERY",
      path: operation,
      args: opts.args,
      middleware: opts.middleware,
      type: opts.type,
      resolver: opts.resolver,
    });
  };

  mutation<T extends Constructor | Constructor[], M extends Middleware[], A extends ModelInterface>(
    operation: Config["path"],
    opts: {
      args?: A,
      type: T
      middleware?: M,
      resolver: Resolver<CombineMiddlewareStates<M, S>, T>
    }
  ): R {
    return this.addRoute<GraphRouteConfig<CombineMiddlewareStates<M, S>, T, A>>({
      method: "MUTATION",
      path: operation,
      args: opts.args,
      middleware: opts.middleware,
      type: opts.type,
      resolver: opts.resolver,
    });
  };

  subscription<T extends Constructor | Constructor[], M extends Middleware[], A extends ModelInterface>(
    operation: Config["path"],
    opts: {
      args?: A,
      type: T
      middleware?: M,
      resolver: Resolver<CombineMiddlewareStates<M, S>, T>
    }
  ): R {
    return this.addRoute<GraphRouteConfig<CombineMiddlewareStates<M, S>, T, A>>({
      method: "SUBSCRIPTION",
      path: operation,
      args: opts.args,
      middleware: opts.middleware,
      type: opts.type,
      resolver: opts.resolver,
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