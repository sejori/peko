import render from "https://jspm.dev/preact-render-to-string@5.1.19"

import { getConfig } from "../../config.ts"
import { PekoPageRouteData } from "../types.ts"

const config = getConfig()
const decoder = new TextDecoder()

type pageCacheItem = { url: string, response: Response, dob: number, lifetime: number }
const pageCache: Array<pageCacheItem> = []

export const ssrHandler = async (request: Request, ssrData: PekoPageRouteData) => {
    // if not devMode and valid response is cached use that
    if (!config.devMode) {
        const cachedResponse = pageCache.find(item => item.url === ssrData.url)
        if (cachedResponse && Date.now() < cachedResponse.dob + cachedResponse.lifetime) {
            return cachedResponse.response
        }
    }

    // import our page component (do we need to create a type for it here?)
    const pageImport = await import(ssrData.componentURL.pathname)
    const pageComponent = pageImport.default

    // ssr preact code to html for browser goodness ^^
    const pageHtml = render(pageComponent(), null, null)

    // TODO: Think about this. Do you want to always serve bundles?
    //       In dev it would be handy to trace errors in source quickly
    //       This can be achieved with a source map... deno bundle?

    // get page component's js bundle
    const bundlePath = `${Deno.cwd()}/stdout/${ssrData.componentURL.pathname.substring(ssrData.componentURL.pathname.lastIndexOf('/') + 1)}`
    const bundledJS = decoder.decode(await Deno.readFile(bundlePath))

    // create script to be injected in html, devsocket in dev for hot reloads & our module/bundle route
    const pageScript = `
        <script type="module" async>
            ${bundledJS}
        </script>
        ${config.devMode
            ? `<script>
                const devSocket = new WebSocket("ws://" + location.host + "/devsocket");
                devSocket.onclose = () => setTimeout(() => location.reload(), ${config.hotReloadDelay});
            </script>`
            : ''
        }
    `

    const body = ssrData.template(request, pageHtml, pageScript)
    const response = new Response(body, {
        headers : new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    })

    cacheResponseItem({ response, url: ssrData.url, dob: Date.now(), lifetime: ssrData.cacheLifetime })

    return response
}

// this is a promise so that is doesn't block the process when called without "await" keyword
const cacheResponseItem = async (newItem: pageCacheItem) => await new Promise((resolve: (value: void) => void) => {
    // remove outdated response from cache if present
    const oldCachedIndex = pageCache.findIndex(item => item.url === newItem.url)
    if (oldCachedIndex > 0) pageCache.splice(oldCachedIndex, 1)

    pageCache.push(newItem)
    return resolve()
})