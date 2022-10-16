import Server, { Emitter, sseHandler, ssrHandler } from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import pages from "../preact/routes/pages.ts"
import assets from "../preact/routes/assets.ts"
import APIs from "../preact/routes/APIs.ts"

import Home from "../preact/src/pages/Home.js"
import htmlTemplate from "../preact/template.ts"

const server = new Server()

// create Emitter - pass logEvent as initial listener so we can see it working
const testEmitter = new Emitter([(e) => server.logEvent(e)])

// emit random value every second
setInterval(() => testEmitter.emit({ value: Math.random() }), 1000)

// SSE route streams data from testEmitter
server.addRoute({
  route: "/sse",
  handler: sseHandler({ emitter: testEmitter })
})

// adjust home page handler templating to include EventSource connection logic
pages[0].handler = ssrHandler({
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

// SSR'ed page routes
pages.forEach(page => server.addRoute(page))
// Static assets
assets.forEach(asset => server.addRoute(asset))
// Custom API functions
APIs.forEach(API => server.addRoute(API))

// Start Peko server :)
server.listen()