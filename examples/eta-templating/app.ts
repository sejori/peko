import * as Peko from "../../mod.ts"
import { renderFile, configure } from "https://deno.land/x/eta@v1.11.0/mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import config from "../config.ts"

// Configure Peko
Peko.setConfig(config)

// Configure eta
configure({
  // This tells Eta to look for templates in the /views directory
  views: `${Deno.cwd()}/examples/eta-templating/views/`
})

// Static source routes for client-side loading
Peko.addStaticRoute({
    route: "/Home.js",
    fileURL: new URL("./src/Home.js", import.meta.url),
    contentType: "application/javascript"
})
Peko.addStaticRoute({
  route: "/Layout.js",
  fileURL: new URL("./src/Layout.js", import.meta.url),
  contentType: "application/javascript"
})
Peko.addStaticRoute({
  route: "/assets/twemoji_chicken.svg",
  fileURL: new URL("./src/assets/twemoji_chicken.svg", import.meta.url),
  contentType: "image/svg+xml"
})
Peko.addStaticRoute({
  route: "/assets/favicon.ico",
  fileURL: new URL("./src/assets/favicon.ico", import.meta.url),
  contentType: "image/x-icon"
})

Peko.addSSRRoute({
  route: "/",
  moduleURL: new URL("./src/Home.js", import.meta.url),
  middleware: (_request, params) => params["server_time"] = Date.now(),
  render: (app, _request, params) => renderToString(app(params), null, null),
  template: (appHTML, _request, params) => renderFile("./template.eta", {
      appHTML,
      title: `<title>Peko</title>`,
      modulepreload: `<script modulepreload="true" type="module" src="/Home.js"></script>`,
      hydrationScript: `<script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import Home from "/Home.js";
          hydrate(Home({ server_time: ${params && params.server_time} }), document.getElementById("root"))
      </script>`
  }),
  cacheLifetime: 6000
})

// Start Peko server :)
Peko.start()