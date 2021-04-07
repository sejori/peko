export default ({ path, css, html, script }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Velocireno 🐓 ${path !== "/" ? `| ${path.slice(1,2).toUpperCase()}${path.slice(2)}` : ""}</title>
        <meta name="description" content="A simple, monolithic web application framework for Deno.">
        <meta name="keywords" content="site, description">
        <style>
            ${css}
        </style>
    </head>
    <body>
        <div id="root">
            ${html}
        </div>
        <script type="module" defer preload>
            ${script}
        </script>
    </body>
    </html>
`