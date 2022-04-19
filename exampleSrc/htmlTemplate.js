export default (_request, params, prerenderedHTML, hydrationModule, hydrationScript) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/assets/favicon.ico">
        <title>Peko ${params.pageTitle ? `| ${params.pageTitle}` : ""}</title>
        <meta name="description" content="${params.description}">
        
        <style>
            ${params.css}
        </style>

        <script modulepreload="true" type="text/javascript" src=${hydrationModule}>
    </head>
    <body>
        <div id="root">
            ${prerenderedHTML}
        </div>

        ${hydrationScript}
    </body>
    </html>
`