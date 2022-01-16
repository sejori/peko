import { setConfig, addRoute, addPageRoute, addStaticRoute, start } from "./index.ts"
import { lookup } from "https://deno.land/x/media_types/mod.ts"

import htmlTemplate from "./exampleSrc/htmlTemplate.js"

// Configure Peko
setConfig({
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
    logDataHandler: (data) => console.log(JSON.stringify(data)),

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
        template: htmlTemplate({ pageTitle: "" }),
        componentURL: new URL("./exampleSrc/pages/Home.js", import.meta.url),
        cacheLifetime: 60
    },
    {
        url: "/about",
        template: htmlTemplate({ pageTitle: "About" }),
        componentURL: new URL("./exampleSrc/pages/About.js", import.meta.url),
        // cacheLifetime: 3600 <- this can be left out as it will default to 3600  
    }
]
pageRoutes.forEach(pageRoute => addPageRoute(pageRoute))

// Setup static asset routes - these use the static middleware
for await (const file of Deno.readDir(`./exampleSrc/assets`, import.meta.url)) {
    if (file.isFile) {
        // must be PekoStaticRouteData type (see types.ts)
        addStaticRoute({
            url: `/assets/${file.name}`,
            fileURL: new URL(`./exampleSrc/assets/${file.name}`, import.meta.url),
            contentType: lookup(file.name)
        })
    }
}

// Setup any custom routes (e.g. any server-side API functions)
const customRoutes = [
    // must be PekoRoute type (see types.ts)
    {
        url: "/api/parrotFcn",
        method: "POST",
        handler: (request) => request.respond({ body: `Parrot sqwarks: ${JSON.stringify(request.body)}` })
    }
]
customRoutes.forEach(route => addRoute(route))

// Start your Peko server :)
start()