import { toFileUrl } from "https://deno.land/std@0.121.0/path/mod.ts";

import { PekoStaticRouteData } from "../types.ts"

export const staticHandler = async (_request: Request, staticData: PekoStaticRouteData) => {
    // const body = await Deno.readFile(toFileUrl(staticData.fileURL.pathname).href)
    const body = await Deno.readFile(toFileUrl(staticData.fileURL.pathname).href)

    return new Response(body, {
        headers: new Headers({
          'Content-Type': staticData.contentType
        })
    })
}