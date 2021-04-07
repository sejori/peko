import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"
import render from "https://cdn.skypack.dev/preact-render-to-string"
import { html } from "https://cdn.skypack.dev/htm/preact"

import { devMode, cssGlob, templateFile } from "../config.js"

const decoder = new TextDecoder()

export const ssrHandler = async (request, pagePath) => {
    const templateImport = await import(templateFile)
    const htmlTemplate = templateImport.default

    const pageImport = await import(pagePath)
    const pageComponent = pageImport.default

    const pageHtml = render(html`<${pageComponent} />`)

    let cssString = ""
    for await (const file of expandGlob(cssGlob)) {
        cssString += `${decoder.decode(await Deno.readFile(file.path))}\n\n`
    }

    return request.respond({
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        }),
        body: htmlTemplate({
            path: request.url,
            css: cssString,
            html: pageHtml, 
            script: `
                import { hydrate } from "https://cdn.skypack.dev/preact"
                import Page from "${pagePath.slice(pagePath.indexOf('/pages'))}"
    
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
    })
}