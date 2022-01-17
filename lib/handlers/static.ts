import { PekoStaticRouteData } from "../types.ts"

// I think there is a much more efficient method by streaming the file...
export const staticHandler = async (_request: Request, staticData: PekoStaticRouteData) => {
    let filePath = decodeURI(staticData.fileURL.pathname)
    // fix shitty windows paths
    if (Deno.build.os === "windows") filePath = filePath.substring(1)

    const body = await Deno.readFile(filePath)

    return new Response(body, {
        headers: new Headers({
          'Content-Type': staticData.contentType
        })
    })
}