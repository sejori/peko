import render from "https://cdn.skypack.dev/preact-render-to-string"
import { html } from "https://cdn.skypack.dev/htm/preact"

import htmlTemplate from "../templates/default.js"

export async function ssrHandler(path) {
    // const templateExport = await import("../templates/default.js")
    const pageExport = await import(path)
    
    const pageRender = htmlTemplate(render(html`<${pageExport.default} />`), `
        import { hydrate } from "https://cdn.skypack.dev/preact"
        import Page from "${path.slice(path.indexOf('/pages'))}"
        
        hydrate(Page(), document.querySelector('#root'))
    `)

    return {
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        }),
        body: pageRender
    }
}