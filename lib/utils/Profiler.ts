import { App } from "../App.ts"
import { Route } from "../types.ts"

type ProfileConfig = {
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
  /**
   * Benchmark performance of all server routes one at a time
   * @param server 
   * @param config 
   * @returns results: ProfileResults
   */
  static async run(app: App, config?: ProfileConfig) {
    const count = (config && config.count) || 100
    const excludedRoutes = (config && config.excludedRoutes) || []

    const results: ProfileResults = {}

    for (const route of app.routes) {
      results[route.path] = { avgTime: 0, requests: [] }

      if (!excludedRoutes.includes(route)) {
        const promises = new Array(count).fill(0).map(async () => {
          const routeUrl = new URL(`http://profile.peko/${route.path}`)
          
          const start = Date.now()
          const response = await app.requestHandler(new Request(routeUrl))
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