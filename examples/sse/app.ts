import Server, { sseHandler, ssrHandler, logger } from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import pages from "../preact/routes/pages.ts"
import assets from "../preact/routes/assets.ts"
import APIs from "../preact/routes/APIs.ts"

import Home from "../preact/src/pages/Home.js"
import htmlTemplate from "../preact/template.ts"

const server = new Server()
server.use(logger(console.log))

const demoEventTarget = new EventTarget()
setInterval(() => {
  demoEventTarget.dispatchEvent(new CustomEvent("data", { detail: Math.random() }))
}, 1000)

// SSE route streams data from testEmitter
server.addRoute({
  route: "/sse",
  handler: sseHandler(demoEventTarget)
})

// adjust home page handler templating to include EventSource connection logic
pages[0].handler = ssrHandler((ctx) => {
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
        const eventData = JSON.parse(e.data)
        document.title = eventData.detail
        document.body.prepend(e.data)
        console.log(e)
      }
      sse.onerror = (e) => {
        sse.close()
        console.log(e)
      }

      document.body.addEventListener("unload", () => sse.close())
    </script>`
  })
})

// SSR'ed page routes
server.addRoutes(pages)
// Static assets
server.addRoutes(assets)
// Custom API functions
server.addRoutes(APIs)

// Start Peko server :^)
server.listen()