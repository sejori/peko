import { walk } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { srcDir, distDir, devMode } from "../../config.js"
import { staticHandler } from "../middlewares/static.js"

export const createStaticRoutes = async () => {
    const staticRoutes = []

    // get src routes
    for await (const file of walk(srcDir)) {
        // only expose asset source files if in production
        if (file.isFile && (devMode ? true : file.path.includes('assets'))) {
            staticRoutes.push({
                method: 'GET',
                url: `${file.path.slice(file.path.indexOf('src') + 3)}`,
                middleware: (request) => staticHandler(request, file.path)
            })
        }
    }

    // get dist routes
    for await (const file of walk(distDir)) {
        if (file.isFile) {
            staticRoutes.push({
                method: 'GET',
                url: `${file.path.slice(file.path.indexOf('dist') + 4)}`,
                middleware: (request) => staticHandler(request, file.path)
            })
        }
    }

    return staticRoutes
}