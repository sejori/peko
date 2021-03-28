import { walk } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { srcHandler } from "../middlewares/src.js"

export const getSrcRoutes = async () => {
    const staticRoutes = []

    for await (const file of walk(`${Deno.cwd()}/src`)) {
        if (file.isFile) {
            staticRoutes.push({
                method: 'GET',
                url: `${file.path.slice(file.path.indexOf('src') + 3)}`,
                middleware: async (request) => await srcHandler(file.path)
            })
        }
    }

    return staticRoutes
}