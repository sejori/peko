import * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import config from "../config.ts"
import assets from "../preact/routes/assets.ts"
import APIs from "../preact/routes/APIs.ts"
import Home from "../preact/src/pages/Home.js"
import htmlTemplate from "../preact/template.ts"

const server = new Peko.Server()
const cache = new Peko.ResponseCache()

// Configure Peko
server.setConfig(config)
// Static assets
assets.forEach(asset => server.addRoute(asset))
// Custom API functions
APIs.forEach(API => server.addRoute(API))

// Custom SSR logic responds preact component JSON data
server.addRoute({
  route: "/",
  method: "GET",
  // memoize our custom handler 
  // (could use cacher middleware like Preact example but this works too)
  handler: cache.memoize(async () => {
    const decoder = new TextDecoder();

    // load the contents of the JS file
    const jsUInt8Array = await Deno.readFile(new URL("../preact/src/pages/Home.js", import.meta.url))
    const jsString = decoder.decode(jsUInt8Array)

    // render app into HTML template
    const appHTML = renderToString(Home({ server_time: `${Date.now()}` }), null, null)
    const HTML = htmlTemplate({
      appHTML,
      title: `<title>Peko</title>`,
      modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
      hydrationScript: `<script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import Home from "/pages/Home.js";
          hydrate(Home(), document.getElementById("root"))
      </script>`
    })

    // object with HTML & JS along with example CSS string
    const customBody = {
      html: HTML,
      css: `body { font-family: monospace !important; }`,
      javascript: jsString
    }

    // send our JSON as the response :D
    return new Response(JSON.stringify(customBody), {
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
  })
})

// Start Peko server :)
server.listen()