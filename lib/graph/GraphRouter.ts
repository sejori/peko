import { CombineMiddlewareStates, Handler, Middleware } from "../core/types.ts";
import { Route, Router, RouteConfig } from "../core/Router.ts";
import { ModelInterface, ModelSchemaType } from "../core/utils/Model.ts";
import { QueryState } from "./middleware/parseQuery.ts";
import { graphHandler } from "./handler/graphHandler.ts";
import { RequestContext } from "../core/context.ts";
import { QueryOperation } from "./utils/QueryParser.ts";
import { Constructor, ResolvedFieldOptions, Resolver } from "../core/utils/Field.ts";

export interface GraphResolver<
  S extends QueryState = QueryState,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  A extends ModelInterface | undefined = ModelInterface,
  N extends boolean = false
> { // extends would be nice but causes type errors on arg count
  (
    ctx: Parameters<Resolver<S, T, N>>[0], 
    args: A extends ModelInterface ? ModelSchemaType<A["schema"]> : undefined
  ): ReturnType<Resolver<S, T, N>>
}

export interface GraphRouteConfig<
  S extends QueryState = QueryState,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  A extends ModelInterface | undefined = ModelInterface,
  N extends boolean = false
> extends RouteConfig<S>, Omit<ResolvedFieldOptions<S, T, N>, "resolver"> {
  method: QueryOperation["type"];
  args?: A;
  type: T;
  resolver: GraphResolver<S, T, A, N>;
}

function resolveVariablesInArgs<T extends object>(
  args: T,
  variables: Record<string, unknown> = {}
): T {
  const resolved: {
    [key: string]: unknown;
  } = {};

  for (const [key, value] of Object.entries(args)) {
    if (typeof value === "string" && value.startsWith("$")) {
      const varName = value.slice(1);
      resolved[key] = variables[varName];
    } else if (value && typeof value === "object") {
      resolved[key] = resolveVariablesInArgs(value, variables);
    } else {
      resolved[key] = value;
    }
  }

  return resolved as T;
}

export class GraphRoute<
  // deno-lint-ignore no-explicit-any
  S extends QueryState = any,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  A extends ModelInterface = ModelInterface,
  N extends boolean = false,
  Config extends GraphRouteConfig<S, T, A, N> = GraphRouteConfig<S, T, A, N>
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
            const rawArgs = ctx.state.query.ast[key]?.args ?? {};
            const resolvedArgs = resolveVariablesInArgs(rawArgs, ctx.state.query.opts.variables);
            const modelArgs = this.config.args
              ? new this.config.args(resolvedArgs)
              : undefined;

            ctx.state.queryResult.data[key] = this.config.resolver(
              ctx,
              modelArgs as A extends ModelInterface ? ModelSchemaType<A["schema"]> : undefined
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
  S extends QueryState = QueryState,
  Config extends GraphRouteConfig<S, Constructor> = GraphRouteConfig<S, Constructor>,
  R extends Route<S, Config> = GraphRoute<S, Constructor, ModelInterface, boolean, Config> 
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

  query<
    T extends Constructor | Constructor[], 
    M extends Middleware[], 
    A extends ModelInterface, 
    N extends boolean
  >(
    operation: Config["path"],
    opts: {
      args?: A,
      type: T,
      nullable?: N,
      middleware?: M,
      resolver: GraphResolver<S, T, A, N>;
    }
  ): R {
    return this.addRoute<GraphRouteConfig<CombineMiddlewareStates<M, S>, T, A, N>>({
      method: "QUERY",
      path: operation,
      args: opts.args,
      middleware: opts.middleware,
      type: opts.type,
      nullable: opts.nullable ? opts.nullable : false as N,
      resolver: opts.resolver,
    });
  };

  mutation<
    T extends Constructor | Constructor[], 
    M extends Middleware[], 
    A extends ModelInterface,
    N extends boolean
  >(
    operation: Config["path"],
    opts: {
      args?: A,
      type: T
      middleware?: M,
      nullable?: N,
      resolver: GraphResolver<S, T, A, N>;
    }
  ): R {
    return this.addRoute<GraphRouteConfig<CombineMiddlewareStates<M, S>, T, A, N>>({
      method: "MUTATION",
      path: operation,
      args: opts.args,
      middleware: opts.middleware,
      type: opts.type,
      nullable: opts.nullable ? opts.nullable : false as N,
      resolver: opts.resolver,
    });
  };

  subscription<
    T extends Constructor | Constructor[], 
    M extends Middleware[], 
    A extends ModelInterface,
    N extends boolean
  >(
    operation: Config["path"],
    opts: {
      args?: A,
      type: T,
      middleware?: M,
      nullable?: N,
      resolver: GraphResolver<S, T, A, N>;
    }
  ): R {
    return this.addRoute<GraphRouteConfig<CombineMiddlewareStates<M, S>, T, A, N>>({
      method: "SUBSCRIPTION",
      path: operation,
      args: opts.args,
      middleware: opts.middleware,
      type: opts.type,
      nullable: opts.nullable ? opts.nullable : false as N,
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