import { StaticRoute } from "../types.ts"

// I think there is a much more efficient method by streaming the file...

/**
 * Static asset request handler
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param staticData: StaticRoute
 * @returns Promise<Response>
 */
export const staticHandler = async (staticData: StaticRoute) => {
    let filePath = decodeURI(staticData.fileURL.pathname)
    
    // fix annoying windows paths
    if (Deno.build.os === "windows") filePath = filePath.substring(1)

    const body = await Deno.readFile(filePath)

    return new Response(body, {
        headers: new Headers(staticData.contentType ? {
          'Content-Type': staticData.contentType
        } : {})
    })
}