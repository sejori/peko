import { RequestContext, ssrHandler, staticHandler, Route } from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { lookup } from "https://deno.land/x/media_types@v3.0.3/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts"
import { renderToString } from "https://cdn.skypack.dev/@vue/server-renderer@3.2.23"

// Vue page component & HTML template
import App from "./src/app.js"
import htmlTemplate from "./template.ts"

export const pages: Route[] = [
  // must be PekoPageRouteData type (see types.ts)
  {
    route: "/",
    handler: ssrHandler({
      srcURL: new URL("./src/app.js", import.meta.url),
      render: () => {
        const appHTML = renderToString(App())
        return htmlTemplate({
          appHTML,
          title: `<title>Peko</title>`,
          modulepreload: `<script modulepreload="true" type="module" src="/app.js"></script>`,
          hydrationScript: `<script type="module">
            import createApp from '/app.js'

            createApp().mount('#app')
          </script>`
        })
      },
    })
  }
]

const srcFiles = await recursiveReaddir(new URL(`./src`, import.meta.url).pathname)
export const assets: Route[] = srcFiles.map(file => {
  const rootPath = `${Deno.cwd()}/examples/vue/src/`
  const fileRoute: `/${string}` = `/${file.slice(rootPath.length)}`

  // must be StaticRoute type (see types.ts)
  return {
    route: fileRoute,
    handler: staticHandler({
      fileURL: new URL(`./src/${fileRoute}`, import.meta.url),
      contentType: lookup(file)
    })
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