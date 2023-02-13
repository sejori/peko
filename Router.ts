import { Middleware, Handler, Route } from "./types.ts"
import { Cascade } from "./utils/Cascade.ts"

export class Router {
  constructor(public routes: Route[] = []) {}

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
   * @returns number - Router.length
   */
    addRoute(route: Route): number
    addRoute(route: Route["path"], data: Handler | Partial<Route>): number
    addRoute(route: Route["path"], middleware: Middleware | Middleware[], handler: Handler): number
    addRoute(
      arg1: Route | Route["path"], 
      arg2?: Partial<Route> | Middleware | Middleware[], 
      arg3?: Handler
    ): number {
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
      
      return this.routes.push(Router.applyDefaults(routeObj))
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