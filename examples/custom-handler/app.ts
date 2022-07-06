import PekoServer, * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import config from "../config.ts"
import { assets, APIs } from "../preact/routes.ts"
import Home from "../preact/src/pages/Home.js"
import htmlTemplate from "../preact/template.ts"

const server = new PekoServer()

// Configure Peko
server.setConfig(config)
// Static assets
assets.forEach(asset => server.addRoute(asset))
// Custom API functions
APIs.forEach(API => server.addRoute(API))

// create a response cache for our custom handler
const memoizeHandler = Peko.createResponseCache()

// Route with cached custom handler - returns preact component JSON data instead of HTML
server.addRoute({
  route: "/",
  method: "GET",
  // memoize our custom handler so responses are cached until lifetime expires
  // and not re-rendered for every request
  handler: memoizeHandler(async () => {
    const decoder = new TextDecoder();

    // load the contents of the JS file
    const jsUInt8Array = await Deno.readFile(new URL("../preact/src/pages/Home.js", import.meta.url))
    const jsString = decoder.decode(jsUInt8Array)

    // here we manually render our app to HTML
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

    // now we take our HTML & JS and add into our JSON data along with an example CSS string
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