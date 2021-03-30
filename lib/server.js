import { config } from "https://deno.land/x/dotenv/mod.ts"
import { serve } from "https://deno.land/std@0.91.0/http/mod.ts"

import getRoutes from "../lib/routes/index.js"

const { ENVIRONMENT } = config({ safe: true })
console.log(`Starting Velocireno in ${ENVIRONMENT} environment. Routes found:`)

const routes = await getRoutes(ENVIRONMENT)
console.log(routes)

const port = 7777
const server = serve({ hostname: "0.0.0.0", port })
console.log(`Velocireno running on port ${port}`)

for await (const request of server) {
    let start = Date.now()
    let status = 200

    // find route matching url & method
    let route = routes.find(route => route.url === request.url && route.method === request.method)
    
    // attempt to respond with route content if route found
    if (route) {
        try {
            const { headers, body } = await route.middleware(request)
            request.respond({ 
                status, 
                headers,
                body,
            }) 
        } catch(error) {
            status = 500
            console.log(error)
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
    console.log(`[${new Date().toString()}] ${status} ${request.method} ${request.url} ${Date.now() - start}ms`)
}
