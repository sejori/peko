import { Middleware } from "../types.ts";
import { Router, Route, RouteConfig } from "./_router.ts";

export interface GraphRouteConfig extends RouteConfig {
  method?: "QUERY" | "MUTATION" | "RESOLVER";
}

export class GraphRoute extends Route {
  declare method: GraphRouteConfig["method"];

  constructor(routeObj: GraphRouteConfig) {
    super(routeObj);
    this.method = (routeObj.method as GraphRoute["method"]) || "QUERY";
  }
}

export class GraphRouter<Config extends RouteConfig = GraphRouteConfig, R extends Route = GraphRoute> extends Router<Config, R> {
  constructor(
    public routes: R[] = [],
    public middleware: Middleware[] = []
  ) {
    super();
  }

  // schema stuff goes here...
}
