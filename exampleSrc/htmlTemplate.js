export default (_request, params, prerenderedHTML, hydrationModules, hydrationScripts) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/exampleSrc/assets/favicon.ico">
        <title>Peko ${params.pageTitle ? `| ${params.pageTitle}` : ""}</title>
        <meta name="description" content="${params.description}">
        
        ${params.css}
        ${hydrationModules}
    </head>
    <body>
        <div id="root">
            ${prerenderedHTML}
        </div>

        ${hydrationScripts}
    </body>
    </html>
`