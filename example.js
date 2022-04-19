import Peko from "./index.ts"
import { lookup } from "https://deno.land/x/media_types/mod.ts"

import htmlTemplate from "./exampleSrc/htmlTemplate.js"
import * as preactRender from "https://jspm.dev/preact-render-to-string@5.1.19"

// global styles (could extract page specific css in future)
const styleString = `
    <style>
        html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            font-family: helvetica;
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
    logHandler: (log) => console.log(log),

    // handle request objects after server response
    logDataHandler: (data) => console.log(JSON.stringify(data)),

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
            css: styleString,
        },
        moduleURL: new URL("./exampleSrc/pages/Home.js", import.meta.url),
        clientHydrate: {
            module: "https://jspm.dev/preact@10.7.1",
            script: `<script type="module">
                import { hydrate as preactHydrate } from "https://jspm.dev/preact@10.7.1";
                preactHydrate(app, document.getElementById("root"));
            </script>`,
        },
        serverRender: (app) => preactRender(app, null, null),
        cacheLifetime: 60
    },
    {
        url: "/",
        moduleURL: new URL("./exampleSrc/pages/About.js", import.meta.url),
        render: (app) => preactRender(app, null, null),
        hydrate: (app) => preactHydrate(app, document.getElementById("root")),
        template: htmlTemplate,
        customParams: {
            pageTitle: "",
            description: "The Featherweight Deno SSR Library",
            css: styleString,
        },
        // cacheLifetime: 3600 <- this can be left out as it will default to 3600
    }
]
pageRoutes.forEach(pageRoute => Peko.addPageRoute(pageRoute))

// Setup static asset routes - these use the static middleware
for await (const file of Deno.readDir(`./exampleSrc/assets`, import.meta.url)) {
    if (file.isFile) {
        // must be PekoStaticRouteData type (see types.ts)
        Peko.addStaticRoute({
            route: `/assets/${file.name}`,
            fileURL: new URL(`./exampleSrc/assets/${file.name}`, import.meta.url),
            contentType: lookup(file.name)
        })
    }
}

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