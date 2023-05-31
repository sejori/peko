import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { bundle } from "https://deno.land/x/emit@0.23.0/mod.ts"
import * as Peko from "../../mod.ts"
import {
  Index,
  About
} from "./pages.ts"

const app = new Peko.App()
app.use(Peko.logger(console.log))

// SSR page routes
app.addRoute(Index)
app.addRoute(About)

// src assets
app.addRoutes(await Peko.routesFromDir(
  new URL("./src/", import.meta.url), 
  (path, url) => ({
    path: path.slice(4) as `/${string}`,
    handler: Peko.staticHandler(url, {
      transform: async (contents) => {
        // bundle and transpile .ts src files for browser
        if (!path.includes(".ts")) return contents
        console.log("Emitting ts bundle: " + url.href)
        const { code } = await bundle(url)
        return code
      },
      headers: path.includes(".ts")
        ? new Headers({ "Content-Type": "application/javascript" })
        : undefined
    })
  })
))

// API functions
const demoEventTarget = new EventTarget()
setInterval(() => demoEventTarget.dispatchEvent(
  new CustomEvent("send", { detail: Math.random() })
), 2500)
app.get("/api/sse", Peko.sseHandler(demoEventTarget))

app.post("/api/parrot", async (ctx) => {
  const body = await ctx.request.text()
  return new Response(`Parrot sqwarks: ${body}`)
})

// Start http server with Peko App :^)
serve((req) => app.requestHandler(req))
console.log(app.allRoutes)