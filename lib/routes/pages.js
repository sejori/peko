import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { ssrHandler } from "../middlewares/pages.js"

export const getPageRoutes = async () => {
    const pageRoutes = []

    for await (const file of expandGlob(`${Deno.cwd()}/src/pages/*.js`)) {
        pageRoutes.push({
            method: 'GET',
            url: file.name === "Home.js" ? "/" : `/${file.name.split('.')[0].toLowerCase()}`,
            middleware: async (request) => {
                const { headers, body } = await ssrHandler(request, file.path)
                request.respond({
                    headers,
                    body,
                }) 
            }
        })
    }

    return pageRoutes
}