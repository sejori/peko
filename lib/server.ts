import { serve } from "https://deno.land/std@0.121.0/http/server.ts"
import { getConfig } from "./config.ts"
import { ssrHandler, staticHandler } from "./handlers/index.ts"

import { Route, SSRRoute, StaticRoute, RequestEvent } from "./types.ts"

const routes: Route[] = []

export const start = () => {
    const config = getConfig()

    config.logHandler(`Starting Peko server on port ${config.port} in ${config.devMode ? "development" : "production"} mode with routes:`)
    routes.forEach(route => config.logHandler(JSON.stringify(route)))

    const requestHandler = async (request: Request) => {
        const start = Date.now()
        let status = 200
        let response

        const requestURL = new URL(request.url)

        const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)
        
        if (route) {
            try {
                response = await route.handler(request)
            } catch(error) {
                status = 500
                config.logHandler(error)
                response = config.errorHandler(request, status)
            }
        } else {
            status = 404
            response = config.errorHandler(request, status)
        }

        const responseTime = Date.now() - start
        logRequest(request, status, start, responseTime)
        return response
    }

    serve(requestHandler, { 
        hostname: config.hostname, 
        port: config.port 
    })
}

export const addRoute = (route: Route) => routes.push(route)

export const addStaticRoute = (routeData: StaticRoute) => addRoute({
    route: routeData.route,
    method: "GET",
    handler: (req) => staticHandler(req, routeData)
})

export const addSSRRoute = (routeData: SSRRoute) => {
    const config = getConfig()

    addRoute({
        route: routeData.route,
        method: "GET",
        handler: (req) => ssrHandler(req, { 
            ...routeData, 
            cacheLifetime: routeData.cacheLifetime ? routeData.cacheLifetime : config.defaultCacheLifetime,
            customTags: routeData.customTags ? routeData.customTags : {} 
        })
    })
}

const logRequest = async (request: Request, status: number, start: number, responseTime: number) => await new Promise((resolve: (value: void) => void) => {
    const config = getConfig()
    
    const headers: Record<string, string> = {}
    for (const pair of request.headers.entries()) {
        headers[pair[0]] = pair[1]
    }

    const requestData: RequestEvent = {
        date: new Date(start).toString(),
        status,
        method: request.method,
        url: request.url,
        responseTime: `${responseTime}ms`,
        headers
    }

    config.logHandler(`[${requestData.date}] ${requestData.status} ${requestData.method} ${requestData.url} ${requestData.responseTime}`)
    config.analyticsHandler(requestData)
    resolve()
})