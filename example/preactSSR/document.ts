export default (input: {
  title: string;
  entrypoint: string;
  ssrHTML: string;
  serverState?: Record<string, unknown>;
}) => `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/twemoji_chick.svg">
    
    <title>${input.title}</title>
    <meta name="description" content="Featherweight apps on the edge">
    <meta name="keywords" content="deno, edge, serverless, preact, peko, cloudflare, bun, typescript, server">

    <script modulepreload="true" type="module" src="${
      input.entrypoint
    }"></script>

    <style>
      html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        font-family: helvetica, sans-serif;
        line-height: 1.5rem;
        display: flex;
        flex-direction: column;
      }

      img { max-width: 100%; object-fit: contain; }
      li { margin: 10px 0; }
      h1 { margin: 1rem; }
      h2 { font-weight: normal; }

      main { flex: 1; }
      .row { display: flex; align-items: center; }
      .justify-around { justify-content: space-around; }

      .container {   
        max-width: 800px;
        margin: 0 auto;
      }

      .align-center {
        display: flex; 
        flex-direction: column;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <div id="root">
      ${input.ssrHTML}
    </div>

    <script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import About from "${input.entrypoint}";
          hydrate(About(${JSON.stringify(
            input.serverState
          )}), document.getElementById("root"))
        </script
  </body>
  </html>`;
