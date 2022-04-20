import { getConfig } from "../../config.ts"
import { PekoPageRouteData } from "../types.ts"

const config = getConfig()

type pageCacheItem = { route: string, response: Response, dob: number, lifetime: number }
const pageCache: Array<pageCacheItem> = []

export const ssrHandler = async (request: Request, ssrData: PekoPageRouteData) => {
    // if not devMode and valid response is cached use that
    if (!config.devMode) {
        const cachedResponse = pageCache.find(item => item.route === ssrData.route)
        if (cachedResponse && Date.now() < cachedResponse.dob + cachedResponse.lifetime) {
            return cachedResponse.response
        }
    }

    // import our page module (do we need to create a type for it here?)
    const pageImport = await import(ssrData.moduleURL.pathname)
    const pageComponent = pageImport.default

    // use provided server-side render function for browser goodness ^^
    const prerenderedHTML = ssrData.serverRender(pageComponent())

    // create client script, contains client-side hydration function + devsocket for hot reloads in devMode
    const pageScripts = `
        ${ssrData.clientHydrate.scripts}
    `
    
    // ${config.devMode
    //     ? `<script>
    //         const devSocket = new WebSocket("ws://" + location.host + "/devsocket");
    //         devSocket.onclose = () => setTimeout(() => location.reload(), ${config.hotReloadDelay});
    //     </script>`
    //     : ''
    // }

    const body = ssrData.template(request, ssrData.customParams, prerenderedHTML, ssrData.clientHydrate.modulepreloads, pageScripts)
    const response = new Response(body, {
        headers : new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    })

    cacheResponseItem({ response, route: ssrData.route, dob: Date.now(), lifetime: ssrData.cacheLifetime })

    return response
}

// this is a promise so that is doesn't block the process when called without "await" keyword
const cacheResponseItem = async (newItem: pageCacheItem) => await new Promise((resolve: (value: void) => void) => {
    // remove outdated response from cache if present
    const oldCachedIndex = pageCache.findIndex(item => item.route === newItem.route)
    if (oldCachedIndex > 0) pageCache.splice(oldCachedIndex, 1)

    pageCache.push(newItem)
    return resolve()
})