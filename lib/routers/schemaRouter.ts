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

export class GraphRouter extends Router {
  constructor(
    public routes: GraphRoute[] = [],
    public middleware: Middleware[] = []
  ) {
    super();
  }

  // schema stuff goes here...
}
