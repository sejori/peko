import render from "https://cdn.skypack.dev/preact-render-to-string"
import { html } from "https://cdn.skypack.dev/htm/preact"

export async function ssrHandler(page) {
    const templateExport = await import("../templates/default.js")
    const pageExport = await import(page.path)
    
    const pageRender = templateExport.default(render(html`<${pageExport.default} />`), `
        import { hydrate } from "https://cdn.skypack.dev/preact"
        import Page from "${page.script}"
        
        hydrate(Page(), document.querySelector('#root'))
    `)

    return {
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        }),
        body: pageRender
    }
}