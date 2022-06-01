import { HandlerParams, SSRRoute } from "../types.ts"
import { hasher } from "../utils/hasher.ts"

/**
 * SSR request handler complete with JS app rendering, HTML templating & response caching logic. 
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ssrData: SSRRoute, request: Request, params: HandlerParams) => {
  let app: Function

  // prioritise module.app over dynamic import for Deno Deploy support
  if (ssrData.module.app) {
    app = ssrData.module.app
  } else if (ssrData.module.srcURL) {
    // import the app module
    const appImport = await import(ssrData.module.srcURL.pathname)
        
    // app module must export app as default
    app = appImport.default
  } else {
    throw new Error("Must provide module.app or module.srcURL to ssrHandler.")
  }

  // use provided render and template fcns for HTML generation
  const HTMLResult = await ssrData.render(app, request, params)    
  const HTML = await ssrData.template(HTMLResult, request, params)

  // TODO: devMode src listeners WASM module graphing 
  const hashString = hasher(HTML)

  return new Response(HTML, {
    headers : new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000',
      // create hash for ETag
      // this lets browser check if file has changed by returning ETag in "if-none-match" header.
      // devMode: new ETag in each response so no browser caching
      // not devMode + memoized: ETag matches "if-none-match" header so 304 (not modified) response given
      'ETag': hashString
    })
  })
}