import { RequestContext, SSRRoute, StaticRoute, Route } from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { lookup } from "https://deno.land/x/media_types@v3.0.3/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

// Preact page components and HTML template
import Home from "./src/pages/Home.js"
import About from "./src/pages/About.js"
import htmlTemplate from "./template.ts"

export const pages: SSRRoute[] = [
  // must be SSRRoute type (see lib/handlers/ssr.ts)
  {
      route: "/",
      // srcURL used for emitting file change events in devMode
      srcURL: new URL("./src/pages/Home.js", import.meta.url),
      middleware: async (ctx: RequestContext, next) => { 
        ctx.data.server_time = `${Date.now()}`
        return await next()
      },
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
        return htmlTemplate({
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

const srcFiles = await recursiveReaddir(new URL(`./src`, import.meta.url).pathname)
export const assets: StaticRoute[] = srcFiles.map(file => {
    const rootPath = `${Deno.cwd()}/examples/preact/src/`
    const fileRoute: `/${string}` = `/${file.slice(rootPath.length)}`

    // must be StaticRoute type (see types.ts)
    return {
        route: fileRoute,
        fileURL: new URL(`./src/${fileRoute}`, import.meta.url),
        contentType: lookup(file)
    }
})

export const APIs: Route[] = [
    // must be Route type (see types.ts)
    {
        route: "/api/parrot",
        method: "POST",
        handler: async (ctx: RequestContext) => {
            // emit event with body as data
            const body = await ctx.request.json()
            return new Response(`Parrot sqwarks: ${JSON.stringify(body)}`)
        }
    }
]