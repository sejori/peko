import { walk } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { staticHandler } from "../middlewares/static.js"

export const getStaticRoutes = async () => {
    const staticRoutes = []

    for await (const file of walk(`${Deno.cwd()}/static`)) {
        if (file.isFile) {
            staticRoutes.push({
                method: 'GET',
                url: `${file.path.slice(file.path.indexOf('static') + 6)}`,
                middleware: async (request) => await staticHandler(file.path)
            })
        }
    }

    return staticRoutes
}