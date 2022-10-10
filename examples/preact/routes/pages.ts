import { 
  Route, 
  ssrHandler, 
  cacher,
  ResponseCache
} from "../../../mod.ts" // <- https://deno.land/x/peko/mod.ts

import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

// Preact page components and HTML template for ssrHandler render logic
import Home from "../src/pages/Home.js"
import About from "../src/pages/About.js"
import htmlTemplate from "../template.ts"

const cache = new ResponseCache()
const env = Deno.env.toObject()

export const pages: Route[] = [
  {
    route: "/",
    middleware: [
      (ctx) => { 
        ctx.state = {
          request_time: `${Date.now()}`,
          ...Deno.env.toObject()
        }
      },
      // async (_ctx, next) => {
      //   // throw("some exception")
      //   // ^ stop middleware stack and respond with 500
      //   const response = await next()
      //   // throw("some exception")
      //   // ^ log the error event after responding
      // },
      //
    ],
    handler: ssrHandler({
      render: (ctx) => {
        const appHTML = renderToString(Home(ctx.state), null, null)
        return htmlTemplate({
          appHTML,
          title: `<title>Peko</title>`,
          modulepreload: `
            <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact"></script>
            <script modulepreload="true" type="module" src="/pages/Home.js"></script>
          `,
          hydrationScript: `<script type="module">
            import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact";
            import Home from "/pages/Home.js";
            hydrate(Home(${JSON.stringify(ctx.state)}), document.getElementById("root"));
          </script>`
        })
      }
    })
  },
  {
    route: "/about",
    middleware: env.ENVIRONMENT === "production" ? cacher(cache) : [],
    // ^ use cacher to serve responses from cache in prod env
    handler: ssrHandler({
      headers: new Headers({
        "Cache-Control": env.ENVIRONMENT === "production"
          ? "max-age=86400, stale-while-revalidate=604800"
          : "no-store"
          // ^ instruct browser to cache page in prod env
      }),
      render: () => {
        const appHTML = renderToString(About(), null, null)
        return htmlTemplate({
          appHTML,
          title: `<title>Peko | About</title>`,
          modulepreload: `
            <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact"></script>
            <script modulepreload="true" type="module" src="/pages/About.js"></script>
          `,
          hydrationScript: `<script type="module">
            import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact";
            import About from "/pages/About.js";
            hydrate(About(), document.getElementById("root"))
          </script>`
        })
      }
    })
  }
]

export default pages