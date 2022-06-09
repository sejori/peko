// Preact page component & template imports
import Home from "./src/pages/Home.js"
import About from "./src/pages/About.js"
import htmlTemplate from "../template.ts"

import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"
import { RequestContext } from "https://deno.land/x/peko/lib/types.ts"

const ssrRoutes = [
  // must be SSRRoute type (see types.ts)
  {
      route: "/",
      // srcURL used for emitting file change events in devMode
      srcURL: new URL("./src/pages/Home.js", import.meta.url),
      middleware: (ctx: RequestContext) => ctx.server_time = `${Date.now()}`,
      render: (ctx: RequestContext) => {
        const appHTML = renderToString(Home(params), null, null)
        return htmlTemplate({
          appHTML,
          title: `<title>Peko</title>`,
          modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
          hydrationScript: `<script type="module">
              import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
              import Home from "/pages/Home.js";
              hydrate(Home(${JSON.stringify(params)}), document.getElementById("root"))
          </script>`
        })
      },
      cacheLifetime: 6000 // <- even with a specified cacheLifetime this page will never change because it's params are different in each request
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
      }
      // cacheLifetime: 6000 <- this can be omitted as page content doesn't change and cacher will default to a lifetime of Infinity
  }
]

export { ssrRoutes }