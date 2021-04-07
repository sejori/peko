import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"
import render from "https://cdn.skypack.dev/preact-render-to-string"
import { html } from "https://cdn.skypack.dev/htm/preact"

import { devMode } from "../config.js"

import htmlTemplate from "../../src/templates/default.js"

const decoder = new TextDecoder()
let cssString = ""
for await (const file of expandGlob(`${Deno.cwd()}/src/styles/*.css`)) {
    cssString += `${decoder.decode(await Deno.readFile(file.path))}\n\n`
}

export const ssrHandler = async (request, path) => {
    const pageExport = await import(path)
    
    const pageRender = htmlTemplate({
        url: request.url,
        css: cssString,
        html: render(html`<${pageExport.default} />`), 
        script: `
            import { hydrate } from "https://cdn.skypack.dev/preact"
            import Page from "${path.slice(path.indexOf('/pages'))}"

            ${devMode 
                ? `
                    const devSocket = new WebSocket("ws://" + location.host + "/devsocket")
                    devSocket.onmessage = (message) => location.reload()
                `
                : ""
            }
            
            hydrate(Page(), document.querySelector('#root'))
        `
    })

    return request.respond({
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        }),
        body: pageRender
    })
}