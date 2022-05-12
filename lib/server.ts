import { serve } from "https://deno.land/std@0.121.0/http/server.ts"
import { getConfig } from "./config.ts"

import { staticHandler } from "./handlers/static.ts"
import { ssrHandler } from "./handlers/ssr.ts"

import { logRequest } from "./utils/logger.ts"
import { createResponseCache } from "./utils/cacher.ts"

import { Route, SSRRoute, StaticRoute } from "./types.ts"

const routes: Route[] = []

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

    let lexRequest: Request;
    const requestHandler = async (request: Request) => {
        const start = Date.now()
        const requestURL = new URL(request.url)
        const route = routes.find(route => route.route === requestURL.pathname && route.method === request.method)

        // store request arg in start() block-scope 
        // to avoid strange closure bug that doesn't seem to affect "start"...
        // this bug began when logRequest() was moved to lib/utils/logger.ts
        lexRequest = request
        
        const respond = (status: number, response: Promise<Response> | Response) => {
            const responseTime = Date.now() - start
            logRequest(lexRequest, status, start, responseTime)
            return response
        }

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

/**
 * Add a basic route to your peko web server.
 * 
 * See "lib/types.ts" for Middleware, Handler & HandlerParams type details
 * 
 * Note: "handlerParams" argument of Middleware and Handler used to pass data from middleware logic to handler logic.
 * 
 * @param routeData { 
        route: string - e.g. "/"
        method: string - e.g. "GET"
        middleware?: Middleware (optional) - e.g. (_request, handlerParams) => handlerParams["time_of_request"] = Date.now()
        handler: Handler - e.g. (_request, handlerParams) => new Response(`${handlerParams["time_of_request"]}`)
    }
 */
export const addRoute = (routeData: Route) => routes.push(routeData)

/**
 * Add a static route
 * 
 * Uses staticHandler from /lib/handlers/static.ts
 * 
 * @param staticRouteData { 
        route: string - e.g. "favicon.png"
        middleware?: Middleware (optional)
        fileURL: URL - e.g. new URL("./assets/favicon.png")
        contentType: string - e.g. "image/png"
    }
 */
export const addStaticRoute = (staticRouteData: StaticRoute) => {
    return addRoute({
        route: staticRouteData.route,
        method: "GET",
        middleware: staticRouteData.middleware,
        handler: (_req, _params) => staticHandler(staticRouteData)
    })
}

/**
 * Add a Server-Side Rendering route
 * 
 * Uses ssrHandler from /lib/handlers/ssr.ts
 * 
 * See "lib/types.ts" for Template, Render & CustomTags type details
 * 
 * @param ssrRouteData { 
        route: string - e.g. "/home"
        middleware?: Middleware (optional)
        template: Template - e.g. (ssrResult, customTags, request) => `<!DOCTYPE html><html><head>${customTags.title}</head><body>${ssrResult}</body></html>`
        render: Render - e.g. (app) => renderToString(app())
        moduleURL: URL - e.g. new URL("./src/home.js")
        customTags?: CustomTags - e.g. () => ({ title: <title>Home Page!</title> })
        cacheLifetime?: number - e.g. 3600000
    }
 */
export const addSSRRoute = (ssrRouteData: SSRRoute) => {
    const config = getConfig()

    const memoizeHandler = createResponseCache({
        lifetime: ssrRouteData.cacheLifetime
    }) 

    const cachedSSRHandler = memoizeHandler((request, params) => ssrHandler(ssrRouteData, request, params))

    return addRoute({
        route: ssrRouteData.route,
        method: "GET",
        middleware: ssrRouteData.middleware,
        handler: async (request, params) => !config.devMode
            // use cache-enabled fcn if not in prod env and pass in params 
            // so we cache renders by params as well as SSRRoute data
            ? await cachedSSRHandler(request, params)
            : await ssrHandler(ssrRouteData, request, params)
    })
}