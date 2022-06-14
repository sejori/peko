// Preact page component & template imports
import Home from "./src/pages/Home.js"
import About from "./src/pages/About.js"
import htmlTemplate from "../template.ts"

import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"
import { RequestContext } from "../../mod.ts"

const pages = [
  // must be SSRRoute type (see lib/handlers/ssr.ts)
  {
      route: "/",
      // srcURL used for emitting file change events in devMode
      srcURL: new URL("./src/pages/Home.js", import.meta.url),
      middleware: (ctx: RequestContext) => { ctx.data.server_time = `${Date.now()}` },
      render: (ctx: RequestContext) => {
        const appHTML = renderToString(Home(ctx.data), null, null)
        return htmlTemplate({
          appHTML,
          title: `<title>Peko</title>`,
          modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
          hydrationScript: `<script type="module">
              import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
              import Home from "/pages/Home.js";
              hydrate(Home(${JSON.stringify(ctx.data)}), document.getElementById("root"))
          </script>`
        })
      },
      // cacheLifetime: 6000 <- unnecessary, page will never cache as ctx.data is different in each render (handler call)
  },
  {
      route: "/about",
      srcURL: new URL("./src/pages/About.js", import.meta.url),
      render: () => {
        const appHTML = renderToString(About(), null, null)
        return  htmlTemplate({
          appHTML,
          title: `<title>Peko | About</title>`,
          modulepreload: `<script modulepreload="true" type="module" src="/pages/About.js"></script>`,
          hydrationScript: `<script type="module">
              import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
              import About from "/pages/About.js";
              hydrate(About(), document.getElementById("root"))
          </script>`
        })
      },
      cacheLifetime: Infinity // <- unnecessary, cacher will default lifetime to Infinity
  }
]

export default pages