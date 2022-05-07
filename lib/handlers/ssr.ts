import { getConfig } from "../config.ts"
import { SSRRoute, HandlerParams } from "../types.ts"
import render from "../utils/render.ts"

const config = getConfig()

type ResponseCacheItem = { key: string, response: Response, dob: number }
const ResponseCache: Array<ResponseCacheItem> = []

const cache = (key: string, fcn: Function) => {
    const store: Record<string, any> = {}

    return (arg: string) => {
        if (store[key]) return store[key]
        const result = fcn(arg)
        store[key] = result
        return result
    }
}

/**
 * SSR request handler complete with JS app rendering, HTML templating & response caching logic. 
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ssrData: SSRRoute) => {
    // if not devMode and valid response is cached use that
    if (!config.devMode && ssrData.cacheLifetime) {
        // cache based on route & params
        // const cachedResponse = ResponseCache.find(item => item.key === `${ssrData.route}-${JSON.stringify(params)}`)
        const cachedResponse = ResponseCache.find(item => item.key === ssrData.route)
        if (cachedResponse && Date.now() < cachedResponse.dob + ssrData.cacheLifetime) {
            return cachedResponse.response
        }
    }

    // import the app module
    const appImport = await import(ssrData.moduleURL.pathname)
        
    // app module must export app as default
    const app = appImport.default

    // use render util for HTML generation
    const HTML = await render(app, ssrData.render, ssrData.template)

    const response = new Response(HTML, {
        headers : new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    })

    cacheResponse({ key: ssrData.route, response: new Response(), dob: Date.now() })
    // cacheResponse({ key: `${ssrData.route}-${JSON.stringify(params)}`, response: new Response(), dob: Date.now() })

    return response
}

// promise so doesn't block process when called without "await" keyword
const cacheResponse = async (newItem: ResponseCacheItem) => await new Promise((resolve: (value: void) => void) => {
    // remove outdated response from cache if present
    const oldCachedIndex = ResponseCache.findIndex(item => item.key === newItem.key)
    if (oldCachedIndex > 0) ResponseCache.splice(oldCachedIndex, 1)

    ResponseCache.push(newItem)
    return resolve()
})