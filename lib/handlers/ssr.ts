import { HandlerParams, SSRRoute } from "../types.ts"

/**
 * SSR request handler complete with JS app rendering, HTML templating & response caching logic. 
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ssrData: SSRRoute, request: Request, params: HandlerParams) => {
    // use provided render and template fcns for HTML generation
    const AppHTML = await ssrData.render(request, params) 
    const HTML = await ssrData.template(AppHTML, request, params)

    return new Response(HTML, {
        headers : new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    })
}