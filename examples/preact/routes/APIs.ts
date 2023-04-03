import { 
  RequestContext, 
  Route,
  sseHandler
} from "https://deno.land/x/peko/mod.ts"

const demoEventTarget = new EventTarget()
setInterval(() => {
  demoEventTarget.dispatchEvent(new CustomEvent("send", { detail: Math.random() }))
}, 2500)

export const APIs: Route[] = [
  {
    path: "/sse",
    handler: sseHandler(demoEventTarget)
  },
  {
    path: "/api/parrot",
    method: "POST",
    handler: async (ctx: RequestContext) => {
      const body = await ctx.request.text()
      return new Response(`Parrot sqwarks: ${body}`)
    }
  }
]

export default APIs