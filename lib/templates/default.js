export default (html, script) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Velocireno 🦕</title>
        <meta name="description" content="The bestest websites you'll ever make.">
        <meta name="keywords" content="site, description">
        <style>
            html, body {
                height: 100%;
                width: 100%;
                margin: 0;
                font-family: helvetica;
            }
        </style>
    </head>
    <body>
        <div id="root">
            ${html}
        </div>
        <script type="module" async preload>
            ${script}
        </script>
    </body>
    </html>
`