import { serve } from "https://deno.land/std/http/mod.ts"
import { lookup } from "https://deno.land/x/media_types/mod.ts"

import { ssrHandler, staticHandler } from "./lib/index.ts"
import { getConfig } from "./config.ts"

import { PekoRoute, PekoPageRouteData, PekoStaticRouteData } from "./types.ts"

const config = getConfig()
const routes: PekoRoute[] = []

export const start = async () => {
    config.logHandler(`Starting Peko server in ${config.devMode ? "development" : "production"} mode with routes:`)

    // if dev create devsocket route
    if (config.devMode) {
        const devSocketImport = await import("./lib/devsocket.ts")
        addRoute({
            method: 'GET',
            url: "/devsocket",
            handler: devSocketImport.devSocket
        })
    }

    routes.forEach(route => config.logHandler(JSON.stringify(route)))

    const server = serve({ 
        hostname: config.hostname, 
        port: config.port 
    })

    for await (const request of server) {
        const start = Date.now()
        let status = 200

        // find route matching url & method
        const route = routes.find(route => route.url === request.url && route.method === request.method)
        
        // attempt to respond with route content if route found
        if (route) {
            try {
                await request.respond(route.handler(request))
            } catch(error) {
                status = 500
                config.logHandler(error)
                request.respond(config.error500Response)
            }
        } else {
            status = 404
            request.respond(config.error404Response)
        }

        // log request summary and handle analytics
        config.logHandler(`[${new Date().toString()}] ${status} ${request.method} ${request.url} ${Date.now() - start}ms`)
        config.requestCaptureHandler(request)
    }
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
