export default ({ pageTitle }) => (html, css) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/assets/favicon.ico">
        <title>Peko ${pageTitle ? `| ${pageTitle}` : ""}</title>
        <meta name="description" content="The featherweight Deno Preact SSR app toolkit.">
        <meta name="keywords" content="site, description">
        <style>
            ${css}
        </style>
    </head>
    <body>
        <div id="root">
            ${html}
        </div>
    </body>
    </html>
`