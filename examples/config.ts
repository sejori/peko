import { Config } from "../lib/types.ts"

const config: Partial<Config> = {
  // host set-up
  port: 7777,
  hostname: "0.0.0.0",

  // page ssr cache lifetime
  defaultCacheLifetime: 3600,

  // hot reload delay for dev mode
  hotReloadDelay: 400,

  // handle log strings from server requests
  logHandler: async (log) => await console.log(log),

  // handle request objects after server response
  analyticsHandler: async (_data) => await null,

  // custom error handling
  errorHandler: async (_request, statusCode) => await new Promise((resolve, _reject) => {
      let response;
      switch (statusCode) {
          case 404: 
              response = new Response("404: Nothing found here!", {
                  headers: new Headers(),
                  status: 404
              })
              break
          default:
              response = new Response("500: Internal Server Error!", {
                  headers: new Headers(),
                  status: 500
              })
              break
      }
      resolve(response);
  })
}

export default config