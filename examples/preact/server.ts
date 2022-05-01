import Peko from "../../mod.ts"
import { Route, SSRRoute } from "../../lib/types.ts"

import { lookup } from "https://deno.land/x/media_types/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir/mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import htmlTemplate from "../template.ts"
import config from "../config.ts"

// Configure Peko
Peko.setConfig(config)

// Setup ssr page routes
const pageRoutes: SSRRoute[] = [
    // must be PekoPageRouteData type (see types.ts)
    {
        route: "/",
        moduleURL: new URL("./src/pages/Home.js", import.meta.url),
        render: (app) => renderToString(app, null, null),
        template: htmlTemplate,
        customTags: {
            title: `<title>Peko</title>`,
            modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
            hydrationScript: `<script type="module">
                import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
                import Home from "/pages/Home.js";
                hydrate(Home(), document.getElementById("root"))
            </script>`
        },
        cacheLifetime: 6000
    },
    {
        route: "/about",
        moduleURL: new URL("./src/pages/About.js", import.meta.url),
        render: (app) => renderToString(app, null, null),
        template: htmlTemplate,
        customTags: {
            title: `<title>Peko | About</title>`,
            modulepreload: `<script modulepreload="true" type="module" src="/pages/About.js"></script>`,
            hydrationScript: `<script type="module">
                import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
                import About from "/pages/About.js";
                hydrate(About(), document.getElementById("root"));
            </script>`
        }
        // cacheLifetime: 3600 <- this can be omitted as it will default to 3600
    }
]
pageRoutes.forEach(pageRoute => Peko.addSSRRoute(pageRoute))

// Setup src file routes - these use the static middleware
const files: string[] = await recursiveReaddir(new URL(`./src`, import.meta.url).pathname)
files.forEach(file => {
    const rootPath = `${Deno.cwd()}/examples/preact/src`
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