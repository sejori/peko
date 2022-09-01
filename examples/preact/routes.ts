import { 
  RequestContext, 
  Route, 
  ssrHandler, 
  staticHandler,
  cacher,
  ResponseCache
} from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts

import { lookup } from "https://deno.land/x/media_types@v3.0.3/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts"
import { fromFileUrl } from "https://deno.land/std@0.150.0/path/mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

// Preact page components and HTML template for ssrHandler render logic
import Home from "./src/pages/Home.js"
import About from "./src/pages/About.js"
import htmlTemplate from "./template.ts"

const cache = new ResponseCache()
const env = Deno.env.toObject()

export const pages: Route[] = [
  {
    route: "/",
    middleware: [
      // async (_ctx, next) => {
      //   // throw("some exception")
      //   // ^ stop middleware stack and respond with 500
      //   await next()
      //   // throw("some exception")
      //   // ^ log the error event after finishing stack and responding
      // },
      (ctx) => { 
        console.log(Deno.env.toObject())
        ctx.state = {
          request_time: `${Date.now()}`,
          request_instance: Deno.env.get("INSTANCE_ID")
        }
      }
    ],
    handler: ssrHandler({
      srcURL: new URL("./src/pages/Home.js", import.meta.url),
      render: (ctx) => {
        const appHTML = renderToString(Home(ctx.state), null, null)
        return htmlTemplate({
          appHTML,
          title: `<title>Peko</title>`,
          modulepreload: `
            <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"></script>
            <script modulepreload="true" type="module" src="/pages/Home.js"></script>
          `,
          hydrationScript: `<script type="module">
            import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
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
      srcURL: new URL("./src/pages/About.js", import.meta.url),
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
            <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"></script>
            <script modulepreload="true" type="module" src="/pages/About.js"></script>
          `,
          hydrationScript: `<script type="module">
            import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
            import About from "/pages/About.js";
            hydrate(About(), document.getElementById("root"))
          </script>`
        })
      }
    })
  }
]

const srcFiles = await recursiveReaddir(fromFileUrl(new URL(`./src`, import.meta.url)))
export const assets: Route[] = srcFiles.map(file => {
  const rootPath = `${Deno.cwd()}/examples/preact/src/`
  const fileRoute: `/${string}` = `/${file.slice(rootPath.length)}`

  return {
    route: fileRoute,
    middleware: cacher(cache),
    handler: staticHandler({
      fileURL: new URL(`./src/${fileRoute}`, import.meta.url),
      headers: new Headers({
        "Cache-Control": env.ENVIRONMENT === "production"
          ? "max-age=86400, stale-while-revalidate=604800"
          : "no-store"
      }),
      contentType: lookup(file)
    })
  }
})

export const APIs: Route[] = [
  {
    route: "/api/parrot",
    method: "POST",
    handler: async (ctx: RequestContext) => {
      const body = await ctx.request.json()
      return new Response(`Parrot sqwarks: ${JSON.stringify(body)}`)
    }
  }
]
