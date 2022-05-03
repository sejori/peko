import { serve } from "https://deno.land/std@0.121.0/http/server.ts"
import { getConfig } from "./config.ts"
import { ssrHandler, staticHandler } from "./handlers/index.ts"

import { Route, SSRRoute, StaticRoute, RequestEvent } from "./types.ts"

const routes: Route[] = []

export const start = () => {
    const config = getConfig()

    config.logString(`Starting Peko server on port ${config.port} in ${config.devMode ? "development" : "production"} mode with routes:`)
    routes.forEach(route => config.logString(JSON.stringify(route)))

    const requestHandler = async (request: Request) => {
        const start = Date.now()
        const requestURL = new URL(request.url)
        const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)
        
        // Optional: used to pass data from middleware to handler
        const handlerParams = {}

        const respond = (status: number, response: Promise<Response> | Response) => {
            const responseTime = Date.now() - start
            logRequest(request, status, start, responseTime)
            return response
        }

        if (!route) return respond(404, await config.errorHandler(404, request))

        // run middleware function first if provided
        if (route.middleware) {
            try {
                const mwResult = await route.middleware(request, handlerParams)
                request = mwResult ? mwResult : request
            } catch (error) {
                config.logString(error)
                return respond(500, await config.errorHandler(500, request, error))
            }
        }

        // run handler function
        let response;
        try {
            response = await route.handler(request, handlerParams)
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

export const addRoute = (route: Route) => routes.push(route)
export const addStaticRoute = (routeData: StaticRoute) => {
    return addRoute({
        route: routeData.route,
        method: "GET",
        middleware: routeData.middleware,
        handler: (req, params) => staticHandler(req, params, routeData)
    })
}
export const addSSRRoute = (routeData: SSRRoute) => {
    const config = getConfig()
    
    const ssrData = { 
        ...routeData, 
        cacheLifetime: routeData.cacheLifetime ? routeData.cacheLifetime : config.defaultCacheLifetime,
        customTags: routeData.customTags ? routeData.customTags : () => ({}) 
    }

    return addRoute({
        route: routeData.route,
        method: "GET",
        middleware: routeData.middleware,
        handler: (req, params) => ssrHandler(req, params, ssrData)
    })
}

const logRequest = async (request: Request, status: number, start: number, responseTime: number) => await new Promise((resolve: (value: void) => void) => {
    const config = getConfig()
    
    const headers: Record<string, string> = {}
    for (const pair of request.headers.entries()) {
        headers[pair[0]] = pair[1]
    }

    const requestEvent: RequestEvent = {
        date: new Date(start).toString(),
        status,
        method: request.method,
        url: request.url,
        responseTime: `${responseTime}ms`,
        headers
    }

    try {
        config.logString(`[${requestEvent.date}] ${requestEvent.status} ${requestEvent.method} ${requestEvent.url} ${requestEvent.responseTime}`)
    } catch (error) {
        console.log(error)
    }

    try {
        config.logEvent(requestEvent)
    } catch (error) {
        console.log(error)
    }
    
    
    resolve()
})