import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
import { Route } from "./types.ts"
import { getConfig } from "./config.ts"
import { logRequest } from "./utils/logger.ts"

export const routes: Route[] = []

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

    // does having respond in lex scope fix this?
    let lexRequest: Request
    let lexStart: number

    // general-purpose function used in various positions in the file
    const respond = (status: number, response: Promise<Response> | Response) => {
        const responseTime = Date.now() - lexStart
        logRequest(lexRequest, status, lexStart, responseTime)
        return response
    }

    const requestHandler = async (request: Request) => {
        // store request arg in start() block-scope 
        // to avoid strange closure bug that doesn't seem to affect "start"...
        // this bug began when logRequest() was moved to lib/utils/logger.ts
        lexRequest = request
        lexStart = Date.now()

        const requestURL = new URL(request.url)
        const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)

        if (!route) return respond(404, await config.errorHandler(404, request))
        
        // run middleware function first if provided
        let mwParams = {}
        if (route.middleware) {
            try {
                mwParams = await route.middleware(request)
            } catch (error) {
                config.logString(error)
                return respond(500, await config.errorHandler(500, request, error))
            }
        }

        // run handler function
        let response
        try {
            response = await route.handler(request, mwParams)
        } catch(error) {
            config.logString(error)
            return respond(500, await config.errorHandler(500, request, error))
        }

        return respond(response.status, response)
    }

    serve(requestHandler, { 
        hostname: config.hostname, 
        port: config.port 
    })
}