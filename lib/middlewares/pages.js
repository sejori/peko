import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"
import render from "https://cdn.skypack.dev/preact-render-to-string"
import { html } from "https://cdn.skypack.dev/htm/preact"

import htmlTemplate from "../../src/templates/default.js"

const decoder = new TextDecoder()
let cssString = ""
for await (const file of expandGlob(`${Deno.cwd()}/src/styles/*.css`)) {
    cssString += `${decoder.decode(await Deno.readFile(file.path))}\n\n`
}

export async function ssrHandler(request, path) {
    const pageExport = await import(path)
    
    const pageRender = htmlTemplate({
        url: request.url,
        css: cssString,
        html: render(html`<${pageExport.default} />`), 
        script: `
            import { hydrate } from "https://cdn.skypack.dev/preact"
            import Page from "${path.slice(path.indexOf('/pages'))}"
            
            hydrate(Page(), document.querySelector('#root'))
        `
    })

    return {
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        }),
        body: pageRender
    }
}