import { walk } from "https://deno.land/std/fs/mod.ts"
import { toFileUrl } from "https://deno.land/std/path/mod.ts"

import { srcDir, distDir, devMode } from "../../config.js"
import { staticHandler } from "../middlewares/static.js"

export const createStaticRoutes = async () => {
    const staticRoutes = []

    // get src routes
    for await (const file of walk(srcDir)) {
        // if prod only expose asset source files not source code
        if (file.isFile && (devMode ? true : file.path.includes('assets'))) {
            const fileUrl = toFileUrl(file.path)
            staticRoutes.push({
                method: 'GET',
                url: `${fileUrl.pathname.slice(fileUrl.pathname.indexOf('src') + 3)}`,
                middleware: (request) => staticHandler(request, fileUrl)
            })
        }
    }

    // expose dist in prod for page bundles routes
    if (!devMode) for await (const file of walk(distDir)) {
        if (file.isFile) {
            const fileUrl = toFileUrl(file.path)
            staticRoutes.push({
                method: 'GET',
                url: `${fileUrl.pathname.slice(file.path.indexOf('dist') + 4)}`,
                middleware: (request) => staticHandler(request, fileUrl)
            })
        }
    }

    return staticRoutes
}