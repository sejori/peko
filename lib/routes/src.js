import { walk } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { srcDir } from "../config.js"
import { staticHandler } from "../middlewares/static.js"

export const getSrcRoutes = async () => {
    const srcRoutes = []

    for await (const file of walk(srcDir)) {
        if (file.isFile) {
            srcRoutes.push({
                method: 'GET',
                url: `${file.path.slice(file.path.indexOf('src') + 3)}`,
                middleware: (request) => staticHandler(request, file.path)
            })
        }
    }

    return srcRoutes
}