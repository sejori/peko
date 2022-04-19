import { serve } from "https://deno.land/std@0.121.0/http/server.ts"

import { ssrHandler, staticHandler } from "./lib/handlers/index.ts"
import { getConfig, setConfig } from "./config.ts"
import { PekoRoute, PekoPageRouteData, PekoStaticRouteData, PekoAnalyticsData } from "./lib/types.ts"

const config = getConfig()
export { getConfig, setConfig }
const routes: PekoRoute[] = []

export const start = async () => {
    config.logHandler(`Starting Peko server on port ${config.port} in ${config.devMode ? "development" : "production"} mode with routes:`)

    // if dev create devsocket route
    if (config.devMode) {
        const devSocketImport = await import("./lib/handlers/devsocket.ts")
        addRoute({
            method: 'GET',
            route: "/devsocket",
            handler: devSocketImport.devSocketHandler
        })
    }

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
                response = config.errorHandler(status, request)
            }
        } else {
            status = 404
            response = config.errorHandler(status, request)
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

export const addRoute = (route: PekoRoute) => routes.push(route)

export const addStaticRoute = (routeData: PekoStaticRouteData) => routes.push({
    route: routeData.route,
    method: "GET",
    handler: (req) => staticHandler(req, routeData)
})

export const addPageRoute = (routeData: PekoPageRouteData) => routes.push({
    route: routeData.route,
    method: "GET",
    handler: (req) => ssrHandler(req, { 
        ...routeData, 
        cacheLifetime: routeData.cacheLifetime ? routeData.cacheLifetime : config.defaultCacheLifetime,
        customParams: routeData.customParams ? routeData.customParams : {} 
    })
})

const logRequest = async (request: Request, status: number, start: number, responseTime: number) => await new Promise((resolve: (value: void) => void) => {
    const headers: Record<string, string> = {}
    for (const pair of request.headers.entries()) {
        headers[pair[0]] = pair[1]
    }

    const logData: PekoAnalyticsData = {
        date: new Date(start).toString(),
        status,
        method: request.method,
        url: request.url,
        responseTime: responseTime,
        headers
    }

    config.logHandler(`[${logData.date}] ${logData.status} ${logData.method} ${logData.url} ${logData.responseTime}`)
    config.analyticsHandler(logData)
    resolve()
})
