import Peko from "https://raw.githubusercontent.com/sebringrose/peko/main/index.ts"
import { lookup } from "https://deno.land/x/media_types/mod.ts"

import htmlTemplate from "https://raw.githubusercontent.com/sebringrose/peko/main/exampleSrc/htmlTemplate.js"

// Configure Peko
Peko.setConfig({
    // host set-up
    port: 7777,
    hostname: "0.0.0.0",

    // page ssr cache lifetime
    defaultCacheLifetime: 3600,

    // hot reload delay for dev mode
    hotReloadDelay: 400,

    // handle log strings from server requests
    logHandler: (log) => console.log(log),

    // handle request objects after server response
    requestCaptureHandler: (analyticsObj) => console.log(JSON.stringify(analyticsObj)),

    // customisable 404 response
    error404Response: new Response("404: Nothing found here!", {
        headers: new Headers(),
        status: 404
    }),

    // customisable 500 response
    error500Response: new Response("500: Internal Server Error!", {
        headers: new Headers(),
        status: 500
    })
})

// Setup page routes - these use the preactSSR middleware
const pageRoutes = [
    // must be PekoPageRouteData type (see types.ts)
    {
        url: "/",
        template: htmlTemplate(),
        componentURL: new URL("./exampleSrc/pages/Home.js"),
        cacheLifetime: 60
    },
    {
        url: "/about",
        template: htmlTemplate({ pageTitle: "About" }),
        componentURL: new URL("./exampleSrc/pages/About.js"),
        // cacheLifetime: 3600 <- this can be left out as it will default to 3600  
    }
]
pageRoutes.forEach(pageRoute => Peko.addPageRoute(pageRoute))

// Setup static asset routes - these use the static middleware
const staticRoutes = []
for await (const file of Deno.readDir(`./exampleSrc/assets`)) {
    // must be PekoStaticRouteData type (see types.ts)
    staticRoutes.push({
        url: `/assets/${file}`,
        fileURL: new URL(`./exampleSrc/assets/${file}`),
        contentType: lookup(file)
    })
}
staticRoutes.forEach(staticRoute => Peko.addStaticRoute(staticRoute))

// Setup any custom routes (e.g. any server-side API functions)
const customRoutes = [
    // must be PekoRoute type (see types.ts)
    {
        url: "/api/parrotFcn",
        method: "POST",
        handler: (request) => request.respond({ body: `Parrot sqwarks: ${JSON.stringify(request.body)}` })
    }
]
customRoutes.forEach(route => Peko.addRoute(route))

// Start your Peko server :)
Peko.start()