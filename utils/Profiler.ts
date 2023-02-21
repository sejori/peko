import { Server } from "../server.ts"
import { Route } from "../types.ts"

type ProfileConfig = {
  mode?: "serve" | "handle"
  url?: string
  count?: number
  excludedRoutes?: Route[]
}

type ProfileResults = Record<
  Route["path"], 
  {
    avgTime: number
    requests: { 
      path: string
      response: Response
      ms: number 
    }[]
  }
>

class Profiler {
  static async run(server: Server, config?: ProfileConfig) {
    const url = (config && config.url) || `http://${server.hostname}:${server.port}`
    const count = (config && config.count) || 100
    const excludedRoutes = (config && config.excludedRoutes) || []
    const mode = (config && config.mode) || "serve"

    const results: ProfileResults = {}

    for (const route of server.routes) {
      results[route.path] = { avgTime: 0, requests: [] }

      if (!excludedRoutes.includes(route)) {
        const promises = new Array(count).fill(0).map(async () => {
          const routeUrl = new URL(`${url}${route.path}`)
          
          const start = Date.now()
          const response = mode === "serve" 
            ? await fetch(routeUrl)
            : await server.requestHandler(new Request(routeUrl))
          const end = Date.now()

          return results[route.path].requests.push({
            path: routeUrl.pathname,
            response,
            ms: end-start
          })
        })

        await Promise.all(promises)

        // calc avg.
        results[route.path].avgTime = results[route.path].requests
          .map(data => data.ms)
          .reduce((a,b) => a+b) / results[route.path].requests.length
      }
    }

    return results
  }
}

export default Profiler