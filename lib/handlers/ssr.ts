import { getConfig } from "../config.ts"
import { SSRRoute } from "../types.ts"

const config = getConfig()

type HTMLCacheItem = { route: string, response: Response, dob: number }
const HTMLCache: Array<HTMLCacheItem> = []

/**
 * SSR request handler complete with JS app rendering, html templating & response caching logic. 
 * 
 * @param request: Request
 * @param params: HandlerParams
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (request: Request, params: Record<string, any>, ssrData: SSRRoute) => {
    // if not devMode and valid response is cached use that
    if (!config.devMode && ssrData.cacheLifetime) {
        const cachedResponse = HTMLCache.find(item => item.route === ssrData.route)
        if (cachedResponse && Date.now() < cachedResponse.dob + ssrData.cacheLifetime) {
            return cachedResponse.response
        }
    }

    // import our page module (do we need to create a type for it here?)
    const pageImport = await import(ssrData.moduleURL.pathname)
    
    // must remind users that the moduleURL for rendering must export the js app as default
    const pageComponent = pageImport.default

    // use provided server-side render function for browser goodness ^^
    const prerenderedHTML = await ssrData.render(pageComponent, request, params)
    const customTags = ssrData.customTags ? ssrData.customTags(request, params) : {}
    const HTML = await ssrData.template(prerenderedHTML, customTags, request)

    const response = new Response(HTML, {
        headers : new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    })

    cacheResponseItem({ response, route: ssrData.route, dob: Date.now() })

    return response
}

// this is a promise so that is doesn't block the process when called without "await" keyword
const cacheResponseItem = async (newItem: HTMLCacheItem) => await new Promise((resolve: (value: void) => void) => {
    // remove outdated response from cache if present
    const oldCachedIndex = HTMLCache.findIndex(item => item.route === newItem.route)
    if (oldCachedIndex > 0) HTMLCache.splice(oldCachedIndex, 1)

    HTMLCache.push(newItem)
    return resolve()
})