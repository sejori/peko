import { RequestContext } from "../core/context.ts";
import { Middleware } from "../core/types.ts";
import { Route, Router, RouteConfig } from "../core/Router.ts";
import { ModelInterface } from "../core/utils/Model.ts";
import { QueryState } from "./middleware/query.ts";
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
      middleware, 
      state, 
      routes
    );
  }

  override async handle(request: Request): Promise<Response> {
    const ctx = new RequestContext(request, this.state);
    const middleware = [...this.middleware];

    // here we will depth-first parse the AST, matching root fields as routes.
    // and their sub-fields as InstanceType<ModelInterface> fields.

    // Run root field resolvers immediately (for sequential mutations) then resolve 
    // fields from resolved response. For fields that do not exist: add to errors,
    // For fields that are resolved: call promise and move on (for dataloader support)

    // when finished traversing AST, copy the resolved AST from ctx.state.queryResult.data
    // into response body and send
    
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
}
