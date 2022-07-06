import { 
  RequestContext, 
  Route, 
  ssrHandler, 
  staticHandler,
  createResponseCache
} from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { lookup } from "https://deno.land/x/media_types@v3.0.3/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts"
import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

// Preact page components and HTML template for ssrHandler render logic
import Home from "./src/pages/Home.js"
import About from "./src/pages/About.js"
import htmlTemplate from "./template.ts"

const memoize = createResponseCache()

export const pages: Route[] = [
  {
    route: "/",
    middleware: [
      async (_ctx, next) => {
        // throw("poop") // <- throwing before await next() will stop middleware chain and respond with 500
        await next()
        // throw("poop") // <- throwing after await next() will let middleware run but log the error as an event
        console.log("sync code executes before resolving prev middleware")
        await new Promise(res => setTimeout(res, 1000))
        console.log("async code executes after resolving prev middleware")
      },
      (ctx) => { 
        ctx.state.server_time = `${Date.now()}`
      }
    ],
    handler: memoize((ctx) => ssrHandler(ctx, {
      srcURL: new URL("./src/pages/Home.js", import.meta.url),
      render: (ctx) => {
        const appHTML = renderToString(Home(ctx.state), null, null)
        return htmlTemplate({
          appHTML,
          title: `<title>Peko</title>`,
          modulepreload: `<script modulepreload="true" type="module" src="/pages/Home.js"></script>`,
          hydrationScript: `<script type="module">
            import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
            import Home from "/pages/Home.js";
            hydrate(Home(${JSON.stringify(ctx.state)}), document.getElementById("root"));
          </script>`
        })
      }
    }))
  },
  {
    route: "/about",
    handler: memoize((ctx) => ssrHandler(ctx, {
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
      }
    }))
  }
]

const srcFiles = await recursiveReaddir(new URL(`./src`, import.meta.url).pathname)
export const assets: Route[] = srcFiles.map(file => {
  const rootPath = `${Deno.cwd()}/examples/preact/src/`
  const fileRoute: `/${string}` = `/${file.slice(rootPath.length)}`

  return {
    route: fileRoute,
    handler: (ctx) => staticHandler(ctx, {
      fileURL: new URL(`./src/${fileRoute}`, import.meta.url),
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