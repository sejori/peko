import * as Peko from "../../mod.ts"
import { Route, SSRRoute } from "../../lib/types.ts"

import { lookup } from "https://deno.land/x/media_types/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir/mod.ts"

import htmlTemplate from "../template.ts"
import config from "../config.ts"

// Vue app module
import App from "./src/app.js"

// VUE FIX
// Add document.createEvent and navigator.userAgent to global namespace
declare global {
    interface Navigator {
        userAgent: string
    }
    interface Window { 
        document: { createEvent: (_x: string) => number },
        navigator: Navigator
    }
}
window.document = { createEvent: (_x) => 0 }
window.navigator.userAgent = "Deno"

// dynamically imported after document.createEvent & navigator.userAgent have been declared
const vueSSR = await import("https://cdn.skypack.dev/@vue/server-renderer@3.2.23")

// Configure Peko
Peko.setConfig(config)

// Setup ssr page routes
const pageRoutes: SSRRoute[] = [
    // must be PekoPageRouteData type (see types.ts)
    {
        route: "/",
        module: {
            srcURL: new URL("./src/app.js", import.meta.url),
            app: App
        },
        render: () => vueSSR.renderToString(App()),
        template: (appHTML) => htmlTemplate({
            appHTML,
            title: `<title>Peko</title>`,
            modulepreload: `<script modulepreload="true" type="module" src="/app.js"></script>`,
            hydrationScript: `<script type="module">
                import createApp from '/app.js'

                createApp().mount('#app')
            </script>`
        }),
        cacheLifetime: 6000
    }
]
pageRoutes.forEach(pageRoute => Peko.addSSRRoute(pageRoute))

// Setup src file routes - these use the static middleware
const files: string[] = await recursiveReaddir(new URL(`./src`, import.meta.url).pathname)
files.forEach(file => {
    const rootPath = `${Deno.cwd()}/examples/vue/src`
    const fileRoute = file.slice(rootPath.length)

    // must be PekoStaticRoute type (see types.ts)
    Peko.addStaticRoute({
        route: fileRoute,
        fileURL: new URL(`./src/${fileRoute}`, import.meta.url),
        contentType: lookup(file)
    })
})

// Setup any custom routes (e.g. any server-side API functions)
const customRoutes: Route[] = [
    // must be PekoRoute type (see types.ts)
    {
        route: "/api/parrotFcn",
        method: "POST",
        handler: async (request: Request) => await new Response(`Parrot sqwarks: ${JSON.stringify(request.body)}`)
    }
]
customRoutes.forEach(route => Peko.addRoute(route))

// Start your Peko server :)
Peko.start()