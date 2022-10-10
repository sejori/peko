import { 
  RequestContext, 
  Route
} from "../../../mod.ts" // <- https://deno.land/x/peko/mod.ts

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

export default APIs