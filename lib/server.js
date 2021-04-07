import { serve } from "https://deno.land/std@0.91.0/http/mod.ts"

import { devMode } from "./config.js"
import { log } from "./utils/logger.js"
import createRoutes from "./routes/index.js"

log(`Starting Beko server in ${devMode ? "development" : "production"} config. Routes found:`)
const routes = await createRoutes()
log(routes)

const port = 7777
const server = serve({ hostname: "0.0.0.0", port })
log(`Beko running on port ${port}`)

for await (const request of server) {
    let start = Date.now()
    let status = 200

    // find route matching url & method
    let route = routes.find(route => route.url === request.url && route.method === request.method)
    
    // attempt to respond with route content if route found
    if (route) {
        try {
            await route.middleware(request)
        } catch(error) {
            status = 500
            log(error)
            request.respond({
                status,
                body: "500: Internal Server Error!"
            })
        }
    } else {
        status = 404
        request.respond({
            status,
            body: "404: Not found!"
        })
    }

    // log request
    log(`[${new Date().toString()}] ${status} ${request.method} ${request.url} ${Date.now() - start}ms`)
}
