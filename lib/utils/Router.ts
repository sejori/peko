import { Middleware, Handler, Route } from "../types.ts"
import { Cascade } from "./Cascade.ts"

export class _Route implements Route {
  path: `/${string}`
  params: Record<string, number> = {}
  regexPath: RegExp
  method?: "GET" | "POST" | "PUT" | "DELETE"
  middleware?: Middleware[] | Middleware
  handler: Handler

  constructor(routeObj: Route) {
    if (!routeObj.path) throw new Error("Route is missing path")
    if (!routeObj.handler) throw new Error("Route is missing handler")

    this.path = routeObj.path
    this.path.split("/").forEach((str, i) => {
      if (str[0] === ":") this.params[str.slice(1)] = i
    });
    this.regexPath = this.params 
      ? new RegExp(this.path.replaceAll(/(?<=\/):(.)*?(?=\/|$)/g, "(.)*"))
      : new RegExp(this.path)

    this.method = routeObj.method || "GET"
    this.handler = Cascade.promisify(routeObj.handler!) as Handler
    this.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!))
  }
}

export class Router {
  constructor(public routes: _Route[] = []) {}

  static applyDefaults(routeObj: Partial<Route>): Route {
    if (!routeObj.path) throw new Error("Route is missing path")
    if (!routeObj.handler) throw new Error("Route is missing handler")

    routeObj.method = routeObj.method || "GET"
    routeObj.handler = Cascade.promisify(routeObj.handler!) as Handler
    routeObj.middleware = [routeObj.middleware]
      .flat()
      .filter(Boolean)
      .map((mware) => Cascade.promisify(mware!))

    return routeObj as Route
  }

  /**
   * Add Route
   * @param route: Route | Route["path"]
   * @param arg2?: Partial<Route> | Middleware | Middleware[], 
   * @param arg3?: Handler
   * @returns route: Route - added route object
   */
  addRoute(route: Route): Route
  addRoute(route: Route["path"], data: Handler | Partial<Route>): Route
  addRoute(route: Route["path"], middleware: Middleware | Middleware[], handler: Handler): Route
  addRoute(
    arg1: Route | Route["path"], 
    arg2?: Partial<Route> | Middleware | Middleware[], 
    arg3?: Handler
  ): Route {
    const routeObj: Partial<Route> = typeof arg1 !== "string"
      ? arg1
      : arguments.length === 2
        ? typeof arg2 === "function"
          ? { path: arg1, handler: arg2 as Handler }
          : { path: arg1, ...arg2 as Partial<Route> }
        : { path: arg1, middleware: arg2 as Middleware | Middleware[], handler: arg3 }

    if (this.routes.find(existing => existing.path === routeObj.path)) {
      throw new Error(`Route with path ${routeObj.path} already exists!`)
    }
    
    const fullRoute = new _Route(routeObj as Route)
    this.routes.push(fullRoute)

    return fullRoute
  }
  /**
   * Add Route with method "GET" (same as default addRoute behaviour)
   * @returns route: Route - added route object
   */
  get: typeof this.addRoute = function() {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments)
    newRoute.method = "GET"
    return newRoute
  }

  /**
   * Add Route with method "POST"
   * @returns route: Route - added route object
   */
  post: typeof this.addRoute = function() {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments)
    newRoute.method = "POST"
    return newRoute
  }

  /**
   * Add Route with method "PUT"
   * @returns route: Route - added route object
   */
  put: typeof this.addRoute = function() {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments)
    newRoute.method = "PUT"
    return newRoute
  }

  /**
   * Add Route with method "DELETE"
   * @returns route: Route - added route object
   */
  delete: typeof this.addRoute = function() {
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(...arguments)
    newRoute.method = "DELETE"
    return newRoute
  }

  /**
   * Add Routes
   * @param routes: Route[] - middleware can be Middlewares or Middleware 
   * @returns number - routes.length
   */
  addRoutes(routes: Route[]): number {
    routes.forEach(route => this.addRoute(route))
    return this.routes.length
  }

  /**
   * Remove Route from Peko server
   * @param route: Route["path"] of route to remove
   * @returns 
   */
  removeRoute(route: Route["path"]): number {
    const routeToRemove = this.routes.find(r => r.path === route)
    if (routeToRemove) {
      this.routes.splice(this.routes.indexOf(routeToRemove), 1)
    }
    
    return this.routes.length
  }

  /**
   * Remove Routes
   * @param routes: Route["path"] of routes to remove
   * @returns 
   */
  removeRoutes(routes: Route["path"][]): number {
    routes.forEach(route => this.removeRoute(route))
    return this.routes.length
  }
}