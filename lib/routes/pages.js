import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { ssrHandler } from "../middlewares/pages.js"

export const createPageRoutes = async () => {
    const pageRoutes = []

    for await (const file of expandGlob(`${Deno.cwd()}/src/pages/*.js`)) {
        pageRoutes.push({
            method: 'GET',
            url: file.name === "Home.js" ? "/" : `/${file.name.split('.')[0].toLowerCase()}`,
            middleware: (request) => ssrHandler(request, file.path)
        })
    }

    return pageRoutes
}