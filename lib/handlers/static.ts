import { PekoStaticRouteData } from "../types.ts"

export const staticHandler = async (_request: Request, staticData: PekoStaticRouteData) => {
    // const body = await Deno.readFile(toFileUrl(staticData.fileURL.pathname).href)
    const body = await Deno.readFile(`file:///C:/${staticData.fileURL.pathname.substring(staticData.fileURL.pathname.lastIndexOf('C:') + 2)}`)

    return new Response(body, {
        headers: new Headers({
          'Content-Type': staticData.contentType
        })
    })
}