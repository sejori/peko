import { meta } from "../../config.js"

export default ({ request, css, script, html }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/assets/favicon.ico">
        <title>${meta.title} ${request.url !== "/" ? `| ${request.url.slice(1,2).toUpperCase()}${request.url.slice(2)}` : ""}</title>
        <meta name="description" content="${meta.description}">
        <meta name="keywords" content="${meta.keywords.join(", ")}">
        <style>
            ${css}
        </style>
    </head>
    <body>
        ${script}
        <div id="root">
            ${html}
        </div>
    </body>
    </html>
`