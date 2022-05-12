import * as Peko from "../../mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import htmlTemplate from "../template.ts"
import config from "../config.ts"

import Home from "./src/Home.js"

// Configure Peko
Peko.setConfig(config)

// create a response cache for our custom SSR 
// (note: it will use config.defaultCacheLifetime if none provided)
const { memoizeHandler } = Peko.createResponseCache()

// Custom route using ResponseCache & our own ssr logic  - returns JSON data for component instead of HTML
Peko.addRoute({
  route: "/",
  method: "GET",
  // memoize our custom handler so responses are cached until lifetime expires
  // and not re-rendered for every request
  handler: memoizeHandler(async (_request: Request) => {
    const decoder = new TextDecoder();

    // load the contents of the JS file
    const jsUInt8Array = await Deno.readFile(new URL("./src/Home.js", import.meta.url))
    const jsString = decoder.decode(jsUInt8Array)

    // here we manually render our app to HTML
    const appHTML = renderToString(Home(), null, null)
    const HTML = htmlTemplate({
      appHTML,
      title: `<title>Peko</title>`,
      modulepreload: `<script modulepreload="true" type="module" src="/src.js"></script>`,
      hydrationScript: `<script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import Home from "/Home.js";
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
Peko.start()