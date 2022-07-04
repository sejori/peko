import * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import config from "../config.ts"
import { pages, assets, APIs } from "../preact/routes.ts"
import Home from "../preact/src/pages/Home.js"
import htmlTemplate from "../preact/template.ts"

// create Emitter - pass logEvent as initial listener so we can see it working
const testEmitter = Peko.createEmitter([Peko.config.logEvent])

// emit random value every second
setInterval(() => testEmitter.emit({ value: Math.random() }), 1000)

// SSE route streams data from testEmitter
Peko.addRoute({
  route: "/sse",
  handler: (ctx) => Peko.sseHandler(ctx, { emitter: testEmitter })
})

// adjust home page handler templating to include EventSource connection logic
pages[0].handler = (ctx) => Peko.ssrHandler(ctx, {
  render: (ctx) => {
    const appHTML = renderToString(Home(ctx.state), null, null)
    return htmlTemplate({
      appHTML,
      title: `<title>Peko</title>`,
      modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
      hydrationScript: `<script type="module">
        import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
        import Home from "/pages/Home.js";
        hydrate(Home(${JSON.stringify(ctx.state)}), document.getElementById("root"))
  
        const sse = new EventSource("/sse")
        sse.onmessage = (e) => {
          document.title = JSON.parse(e.data).value
          console.log(e)
        }
      </script>`
    })
  }
})

// SSR'ed app page routes
pages.forEach(page => Peko.addRoute(page))
// Static assets
assets.forEach(asset => Peko.addRoute(asset))
// Custom API functions
APIs.forEach(API => Peko.addRoute(API))

// Start Peko server :)
Peko.start()