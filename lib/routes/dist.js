import { ensureFile, existsSync } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { deps, distDir } from "../config.js"
import { bundle } from "../utils/bundler.js"

import { staticHandler } from "../middlewares/static.js"

export const createDistRoutes = async () => {
    const distRoutes = Promise.all(Object.keys(deps).map(async dep => {
        const bundleUrl = `${distDir}/${dep}.js`

        // create bundle path if !exists
        await ensureFile(bundleUrl)

        // create bundle if bundle file !exists
        if (!existsSync(bundleUrl)) {
            await bundle(deps[dep], bundleUrl)
        }

        return {
            method: 'GET',
            url: `${bundleUrl.slice(bundleUrl.indexOf('dist') + 4)}`,
            middleware: (request) => staticHandler(request, bundleUrl)
        }
    }))

    return distRoutes
}