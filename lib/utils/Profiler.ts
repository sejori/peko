import { Router } from "../Router.ts";
import { Route } from "../types.ts";

type ProfileConfig = {
  mode?: "serve" | "handle";
  url?: string;
  count?: number;
  excludedRoutes?: Route[];
};

type ProfileResults = Record<
  Route["path"],
  {
    avgTime: number;
    requests: {
      path: string;
      response: Response;
      ms: number;
    }[];
  }
>;

export class Profiler {
  /**
   * Benchmark performance of all server routes one at a time
   * @param router
   * @param config
   * @returns results: ProfileResults
   */
  static async run(router: Router, config?: ProfileConfig) {
    const url = (config && config.url) || `http://localhost:7777`;
    const count = (config && config.count) || 100;
    const excludedRoutes = (config && config.excludedRoutes) || [];
    const mode = (config && config.mode) || "serve";

    const results: ProfileResults = {};

    for (const route of router.httpRoutes) {
      results[route.path] = { avgTime: 0, requests: [] };

      if (!excludedRoutes.includes(route)) {
        const promises = new Array(count).fill(0).map(async () => {
          const routeUrl = new URL(`${url}${route.path}`);

          const start = performance.now();
          const response =
            mode === "serve"
              ? await fetch(routeUrl)
              : await router.handle(new Request(routeUrl));
          const end = performance.now();

          return results[route.path].requests.push({
            path: routeUrl.pathname,
            response,
            ms: end - start,
          });
        });

        await Promise.all(promises);

        // calc avg.
        results[route.path].avgTime =
          results[route.path].requests
            .map((data) => data.ms)
            .reduce((a, b) => a + b) / results[route.path].requests.length;
      }
    }

    return results;
  }
}

export default Profiler;
