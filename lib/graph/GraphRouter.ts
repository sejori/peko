import { RequestContext } from "../core/context.ts";
import { Middleware } from "../core/types.ts";
import { Route, Router, RouteConfig } from "../core/Router.ts";
import { ModelInterface } from "../core/utils/Model.ts";
import { query, QueryState } from "./middleware/query.ts";
import { queryResult } from "./handler/queryResults.ts";
import { QueryOperation } from "./utils/QueryParser.ts";
import { Cascade } from "../core/utils/Cascade.ts";

export interface GraphRouteConfig<S extends QueryState = QueryState> extends RouteConfig<S> {
  name: QueryOperation["name"];
  operation: QueryOperation["type"];
  type: ModelInterface | ModelInterface[];
  resolver: Middleware<S>;
}

export class GraphRoute<S extends QueryState = QueryState> extends Route<S> {
  declare name: string;
  declare operation: GraphRouteConfig<S>["operation"];
  type: ModelInterface | ModelInterface[]

  constructor(routeObj: GraphRouteConfig<S>) {
    super(routeObj);
    this.operation = routeObj.operation;
    this.type = routeObj.type;
  }

  get fields(): string[] {
    return Object.keys(Array.isArray(this.type)
      ? this.type[0].schema
      : this.type.schema
    );
  }

  override get regexPath(): RegExp {
    return new RegExp(
      `\\b${this.operation.toLowerCase()}\\b.*\\b${this.name}\\b`, 
      "i"
    );
  }
}

export class GraphRouter<
  S extends QueryState,
  Config extends GraphRouteConfig<S> = GraphRouteConfig<S>,
  R extends Route<S> = GraphRoute<S>
> extends Router<S, Config, R> {
  override Route = GraphRoute<S>;

  constructor(
    middleware: Middleware<S>[] = [], 
    state?: S, 
    routes: Record<string, R> = {}
  ) {
    super(
      [query, ...middleware], 
      state, 
      routes
    );
  }

  override async handle(request: Request): Promise<Response> {
    const ctx = new RequestContext(request, this.state);
    const middleware = [...this.middleware];

    // dataloader implementation using ctx.state.ast and attached routes
    // ctx.state.ast ...
    
    const res = await new Cascade(ctx, middleware).run();
    return res ? res : new Response("", { status: 404 });
  }

  query: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "QUERY";
    newRoute.handler = queryResult;
    return newRoute;
  };

  mutation: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "MUTATION";
    newRoute.handler = queryResult;
    return newRoute;
  };

  subscription: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "SUBSCRIPTION";
    newRoute.handler = queryResult;
    return newRoute;
  };

  resolver: typeof this.addRoute = function () {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments);
    newRoute.method = "RESOLVER";
    newRoute.handler = queryResult;
    return newRoute;
  };
}
