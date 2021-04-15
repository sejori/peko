import { expandGlob, ensureFile } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { pagesGlob, distDir, devMode } from "../../config.js"
import { bundle } from "../utils/bundler.js"
import { ssrHandler } from "../middlewares/ssr.js"

export const createPageRoutes = async () => {
    const pageRoutes = []

    for await (const file of expandGlob(pagesGlob)) {
        const isHome = file.name === 'Home.js'
        const pagePath = file.path
        let bundleUrl = pagePath.slice(pagePath.indexOf('/pages'))
        let middleware = (request) => ssrHandler(request, pagePath, bundleUrl)

        // if prod generate page bundles and use caching middleware
        if (!devMode) {
            const cacheHandlerImport = await import("../middlewares/cache.js")
            const cacheHandler = cacheHandlerImport.cacheHandler
            middleware = (request) => cacheHandler(request, middleware)

            const bundlePath = `${distDir}/${file.name}`

            // create bundle path if !exists
            await ensureFile(bundlePath)

            // create bundle
            await bundle(pagePath, bundlePath)
            bundleUrl = `/${bundlePath.slice(bundlePath.indexOf(file.name))}`
        }
        
        pageRoutes.push({
            method: 'GET',
            url: isHome ? '/' : `/${file.name.split('.')[0].toLowerCase()}`,
            middleware
        })
    }

    return pageRoutes
}