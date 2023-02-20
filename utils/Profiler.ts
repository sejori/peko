import Server, { Route } from "../server.ts"

class Profiler {
  constructor(public server: Server) {}

  static handleRoutes(server: Server, count: number = 100, excludedRoutes: Route[] = []) {
    for (const route of server.routes) {
      if (!excludedRoutes.includes(route)) {
        const request = new Request(new URL(`${server.hostname}:${server.port}${route.route}`))
        const response = server.requestHandler()
      }
    }
  }

  static requestRoutes(server: Server, count: number = 100, excludedRoutes: Route[] = []) {

  }
}

export default Profiler