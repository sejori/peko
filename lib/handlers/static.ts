import { PekoStaticRouteData } from "../types.ts"

export const staticHandler = async (_request: Request, staticData: PekoStaticRouteData) => {
    const body = await Deno.readFile(staticData.fileURL.pathname)

    return new Response(body, {
        headers: new Headers({
          'Content-Type': 'text/html; charset=utf-8'
        })
    })
}