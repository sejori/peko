import * as Peko from "../../mod.ts"
import config from "../config.ts"

import { renderFile, configure as configureEta } from "https://deno.land/x/eta@v1.12.3/mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"
import { lookup } from "https://deno.land/x/media_types/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir/mod.ts"

import Home from "../preact/src/pages/Home.js"

// Configure Peko
Peko.setConfig(config)

// Configure eta
configureEta({
  // This tells Eta to look for templates in the /views directory
  views: `${Deno.cwd()}/examples/eta-templating/views/`
})

// SSR Route using eta renderFile fcn 
Peko.addSSRRoute({
  route: "/",
  module: {
    srcURL: new URL(`../preact/src/Home.js`, import.meta.url),
    app: Home
  },
  middleware: (_request) => ({ "server_time": `${Date.now()}` }),
  render: async (app, _request, params) => {
    const appHTML = renderToString(app(params), null, null)
    const etaResult = await renderFile("./template.eta", {
      appHTML,
      title: `<title>Peko</title>`,
      modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
      hydrationScript: `<script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import Home from "/pages/Home.js";
          hydrate(Home({ server_time: ${params && params.server_time} }), document.getElementById("root"))
      </script>`
    })
    return etaResult ? etaResult : `Eta templating error!`
  },
  cacheLifetime: 6000
})

// Static source routes for client-side loading
const files: string[] = await recursiveReaddir(new URL(`../preact/src`, import.meta.url).pathname)
files.forEach(file => {
    const rootPath = `${Deno.cwd()}/examples/preact/src/`
    const fileRoute = file.slice(rootPath.length)

    // must be PekoStaticRoute type (see types.ts)
    Peko.addStaticRoute({
        route: `/${fileRoute}`,
        fileURL: new URL(`../preact/src/${fileRoute}`, import.meta.url),
        contentType: lookup(file)
    })
})

// Start Peko server :)
Peko.start()