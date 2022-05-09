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

    // import the app module
    const appImport = await import(ssrData.moduleURL.pathname)
        
    // app module must export app as default
    const app = appImport.default

    // use provided render and template fcns for HTML generation
    const HTMLResult = await ssrData.render(app, request, params)    
    const HTML = await ssrData.template(HTMLResult, request, params)

    return new Response(HTML, {
        headers : new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    })
}