import { serve } from "https://deno.land/std@0.121.0/http/server.ts"

import { ssrHandler, staticHandler } from "./lib/handlers/index.ts"
import { getConfig, setConfig } from "./config.ts"

import { PekoRoute, PekoPageRouteData, PekoStaticRouteData, PekoLogData } from "./lib/types.ts"

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
            url: "/devsocket",
            handler: devSocketImport.devSocketHandler
        })
    }

    routes.forEach(route => config.logHandler(JSON.stringify(route)))

    const requestHandler = async (request: Request) => {
        const start = Date.now()
        let status = 200
        let response

        const requestURL = new URL(request.url)

        // find route matching url & method
        const route = routes.find(route => route.url === requestURL.pathname && route.method === request.method)
        
        // attempt to respond with route content if route found
        if (route) {
            try {
                response = await route.handler(request)
            } catch(error) {
                status = 500
                config.logHandler(error)
                response = config.error500Response
            }
        } else {
            status = 404
            response = config.error404Response
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

export const addPageRoute = (routeData: PekoPageRouteData) => routes.push({
    url: routeData.url,
    method: "GET",
    // use default cacheLifetime if none provided  
    handler: (req) => ssrHandler(req, { ...routeData, cacheLifetime: routeData.cacheLifetime ? routeData.cacheLifetime : config.defaultCacheLifetime })
})

export const addStaticRoute = (routeData: PekoStaticRouteData) => routes.push({
    url: routeData.url,
    method: "GET",
    handler: (req) => staticHandler(req, routeData)
})

const logRequest = async (request: Request, status: number, start: number, responseTime: number) => await new Promise((resolve: (value: void) => void) => {
    // log request summary and handle analytics
    const headers: Record<string, string> = {}
    for (const pair of request.headers.entries()) {
        headers[pair[0]] = pair[1]
    }

    const logData: PekoLogData = {
        date: new Date(start).toString(),
        status,
        method: request.method,
        url: request.url,
        responseTime: responseTime,
        headers
    }

    config.requestDataHandler(logData)
    resolve()
})
