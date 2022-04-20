import Peko from "./index.ts"
import { lookup } from "https://deno.land/x/media_types/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir/mod.ts"

import htmlTemplate from "./exampleSrc/htmlTemplate.js"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

// global styles (could extract page specific css in future)
const style = `
    <style>
        html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            font-family: helvetica, sans-serif;
        }

        img { max-width: 100%; }
        li { margin: 10px 0; }
        a { color: royalblue; }
        a:visited { color: hotpink; }
        .container { max-width: 900px; margin: auto; }
        .row { display: flex; }
        .justify-around { justify-content: space-around; }

        .btn-lg-primary {
            border: solid 1px limegreen;
            background-color: turquoise;
            padding: 0.5rem;
            font-size: 1rem;
        }

        .btn-lg-secondary {
            border: solid 1px red;
            background-color: orange;
            padding: 0.5rem;
            font-size: 1rem;
        }
    </style>
`

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
    logHandler: async (log) => await console.log(log),

    // handle request objects after server response
    analyticsHandler: async (_data) => await null,

    // custom error handling
    errorHandler: async (statusCode, _request) => await new Promise((resolve, _reject) => {
        let response;
        switch (statusCode) {
            case 404: 
                response = new Response("404: Nothing found here!", {
                    headers: new Headers(),
                    status: 404
                })
                break
            default:
                response = new Response("500: Internal Server Error!", {
                    headers: new Headers(),
                    status: 500
                })
                break
        }
        resolve(response);
    })
})

// Setup ssr page routes
const pageRoutes = [
    // must be PekoPageRouteData type (see types.ts)
    {
        route: "/",
        template: htmlTemplate,
        customParams: {
            pageTitle: "",
            description: "The Featherweight Deno SSR Library",
            css: style,
        },
        moduleURL: new URL("./exampleSrc/pages/Home.js", import.meta.url),
        clientHydrate: {
            modulepreloads: `
                <script modulepreload="true" type="text/plain" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"></script>
                <script modulepreload="true" type="module" src="/exampleSrc/pages/Home.js"></script>
            `,
            scripts: `
                <script type="module">
                    import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
                    import Home from "/exampleSrc/pages/Home.js";
                    hydrate(Home(), document.getElementById("root"))
                </script>
            `,
        },
        serverRender: (app) => renderToString(app, null, null),
        cacheLifetime: 6000
    },
    {
        route: "/about",
        template: htmlTemplate,
        customParams: {
            pageTitle: "",
            description: "The Featherweight Deno SSR Library",
            css: style,
        },
        moduleURL: new URL("./exampleSrc/pages/About.js", import.meta.url),
        clientHydrate: {
            modulepreloads: `
                <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"></script>
                <script modulepreload="true" type="module" src="/exampleSrc/pages/About.js"></script>
            `,
            scripts: `
                <script type="module">
                    import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
                    import About from "/exampleSrc/pages/About.js";
                    hydrate(About(), document.getElementById("root"));
                </script>
            `,
        },
        serverRender: (app) => renderToString(app, null, null),
        // cacheLifetime: 3600 <- this can be left out as it will default to 3600
    }
]
pageRoutes.forEach(pageRoute => Peko.addPageRoute(pageRoute))

// Setup src file routes - these use the static middleware
const files = await recursiveReaddir(`./exampleSrc`) 
files.forEach(file => {
    file = `/${file}`

    // must be PekoStaticRouteData type (see types.ts)
    Peko.addStaticRoute({
        route: file,
        fileURL: new URL(`.${file}`, import.meta.url),
        contentType: lookup(file)
    })
})

// Setup any custom routes (e.g. any server-side API functions)
const customRoutes = [
    // must be PekoRoute type (see types.ts)
    {
        route: "/api/parrotFcn",
        method: "POST",
        handler: (request) => new Response(`Parrot sqwarks: ${JSON.stringify(request.body)}`)
    }
]
customRoutes.forEach(route => Peko.addRoute(route))

// Start your Peko server :)
Peko.start()