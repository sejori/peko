import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { ssrHandler } from "../middlewares/pages.js"

export const getPageRoutes = async () => {
    const pageRoutes = []

    for await (const file of expandGlob(`${Deno.cwd()}/static/js/pages/*.js`)) {
        pageRoutes.push({
            method: 'GET',
            url: file.name === "Home.js" ? "/" : `/${file.name.split('.')[0].toLowerCase()}`,
            middleware: async (request) => await ssrHandler({
                path: file.path,
                script: file.path.slice(file.path.indexOf('/js'))
            })
        })
    }

    return pageRoutes
}