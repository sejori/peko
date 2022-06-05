import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { Route } from "./types.ts"
import { getConfig } from "./config.ts"
import { logRequest, logError } from "./utils/logger.ts"

export const routes: Route[] = []

const requestHandler = async (request: Request) => {
  const start = Date.now()
  const config = getConfig()

  // locate matching route
  const requestURL = new URL(request.url)
  const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)
  if (!route) {
    logRequest(request, 404, start, Date.now() - start)
    return await config.errorHandler(404, request)
  }
  
  // run middleware function first if provided
  let mwParams = {}
  if (route.middleware) {
    try {
      mwParams = await route.middleware(request)
    } catch (error) {
      logError(request.url, error, new Date())
      logRequest(request, 500, start, Date.now() - start)
      return await config.errorHandler(500, request)
    }
  }

  // run handler function
  let response
  try {
    response = await route.handler(request, mwParams)
  } catch(error) {
    logError(request.url, error, new Date())
    logRequest(request, 500, start, Date.now() - start)
    return await config.errorHandler(500, request)
  }

  logRequest(request, response.status, start, Date.now() - start)
  return response
}

/**
 * Begin listening to http requests and serve matching routes.
 * 
 * See "lib/types.ts" for Config type details.
 * 
 * Note: Config changes will not take effect after start is called. 
 */
export const start = () => {
  const config = getConfig()
  config.logString(`Starting Peko server on port ${config.port} in ${config.devMode ? "development" : "production"} mode with routes:`)
  routes.forEach(route => config.logString(JSON.stringify(route)))

  serve(requestHandler, { 
    hostname: config.hostname, 
    port: config.port 
  })
}