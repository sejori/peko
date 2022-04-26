export default (_request, customTags, HTML) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/exampleSrc/assets/favicon.ico">
        
        ${customTags.title}
        <meta name="description" content="The Featherweight Deno SSR Library">
        
        ${customTags.style}
        ${customTags.modulepreloads}
    </head>
    <body>
        <div id="root">
            ${HTML}
        </div>

        ${customTags.hydrationScript}
    </body>
    </html>
`