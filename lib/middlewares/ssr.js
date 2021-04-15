import { expandGlob } from "https://deno.land/std@0.91.0/fs/mod.ts"

import { html } from "https://cdn.skypack.dev/htm/preact"
import render from "https://cdn.skypack.dev/preact-render-to-string"

import { devMode, cssGlob, templateFile, reloadDelay } from "../config.js"
import { setCache } from "../utils/cacher.js"

const decoder = new TextDecoder()

export const ssrHandler = async (request, pagePath, bundleUrl) => {
    const templateImport = await import(templateFile)
    const htmlTemplate = templateImport.default

    const pageImport = await import(pagePath)
    const pageComponent = pageImport.default

    const pageHtml = render(html`<${pageComponent} />`)
    let pageCss = ""
    for await (const file of expandGlob(cssGlob)) {
        pageCss += `${decoder.decode(await Deno.readFile(file.path))}\n\n`
    }
    const pageScript = `
        ${devMode && `<script>
            const devSocket = new WebSocket("ws://" + location.host + "/devsocket");
            devSocket.onclose = () => setTimeout(() => location.reload(), ${reloadDelay});
        </script>`}
        <script src="${bundleUrl}" type="module" defer preload></script>
    `

    const headers = new Headers({
        'Content-Type': 'text/html; charset=utf-8'
    })

    const body = htmlTemplate({
        request: request,
        html: pageHtml,
        css: pageCss, 
        script: pageScript,
    })

    const response = {
        headers,
        body
    }

    // these fcn calls only cache in prod mode with redis connection
    // note: useless without the cacheHandler middleware wrapping this middleware
    // (which it does in prod mode, check /lib/routes/pages.js)
    setCache(request.url, response)
    setCache(`${request.url}_DOB`, Date.now())

    return request.respond(response)
}