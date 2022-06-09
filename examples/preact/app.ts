import * as Peko from "https://deno.land/x/peko/mod.ts"
import { lookup } from "https://deno.land/x/media_types@v3.0.3/mod.ts"
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts"
import config from "../config.ts"

// Configure Peko
Peko.setConfig(config)

console.log(Peko.getConfig())

// SSR'ed app page routes

ssrRoutes.forEach(ssrRoute => Peko.addSSRRoute(ssrRoute))

// Static src routes for loading into client
const files = await recursiveReaddir(new URL(`./src`, import.meta.url).pathname)
files.forEach(file => {
    const rootPath = `${Deno.cwd()}/examples/preact/src/`
    const fileRoute: `/${string}` = `/${file.slice(rootPath.length)}`

    // must be StaticRoute type (see types.ts)
    Peko.addStaticRoute({
        route: fileRoute,
        fileURL: new URL(`./src/${fileRoute}`, import.meta.url),
        contentType: lookup(file)
    })
})

// Custom routes (e.g. any server-side API functions)
const customRoutes = [
    // must be Route type (see types.ts)
    {
        route: "/api/parrot",
        method: "POST",
        handler: async (request: Request) => {
            // emit event with body as data
            const body = await request.json()
            return new Response(`Parrot sqwarks: ${JSON.stringify(body)}`)
        }
    }
]
customRoutes.forEach(route => Peko.addRoute(route))

// Start Peko server :)
Peko.start()