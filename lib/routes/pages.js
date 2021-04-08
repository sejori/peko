import { expandGlob, ensureFile } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { pagesGlob, distDir, devMode } from "../config.js"
import { bundle } from "../utils/bundler.js"
import { ssrHandler } from "../middlewares/ssr.js"

export const createPageRoutes = async () => {
    const pageRoutes = []
    let cacheHandler = () => {}

    for await (const file of expandGlob(pagesGlob)) {
        const isHome = file.name === "Home.js"
        const pagePath = file.path

        // URL for page source module (used in development mode)
        let bundleUrl = pagePath.slice(pagePath.indexOf('/pages'))
        
        // if prod generate page bunldes and replace bundleUrl
        if (!devMode) {
            const cacheHandlerImport = await import("../middlewares/cache.js")
            cacheHandler = cacheHandlerImport.cacheHandler

            bundleUrl = `${distDir}/${file.name}`

            // create bundle path if !exists
            await ensureFile(bundleUrl)

            // create bundle
            await bundle(pagePath, bundleUrl)
            bundleUrl = `/${bundleUrl.slice(bundleUrl.indexOf(file.name))}`
        }
        
        pageRoutes.push({
            method: 'GET',
            url: isHome ? "/" : `/${file.name.split('.')[0].toLowerCase()}`,
            middleware: devMode 
                ? (request) => ssrHandler(request, pagePath, bundleUrl)
                : (request) => cacheHandler(
                    request, 
                    () => ssrHandler(request, pagePath, bundleUrl)
                )
        })
    }

    return pageRoutes
}