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
    <!-- Made with https://generator.jspm.io/ --> 
    <script type="importmap">
      {
        "imports": {
          "react": "https://ga.jspm.io/npm:react@18.3.1/dev.index.js",
          "react/jsx-runtime": "https://ga.jspm.io/npm:react@18.3.1/dev.jsx-runtime.js",
          "react-dom/client": "https://ga.jspm.io/npm:react-dom@18.3.1/dev.client.js"
        },
        "scopes": {
          "https://ga.jspm.io/": {
            "react-dom": "https://ga.jspm.io/npm:react-dom@18.3.1/dev.index.js",
            "scheduler": "https://ga.jspm.io/npm:scheduler@0.23.2/dev.index.js"
          }
        }
      }
    </script>
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
      import App from "${input.entrypoint}";
      import { hydrateRoot } from 'react-dom/client';

      hydrateRoot(
        document.getElementById('root'),
        App(${JSON.stringify(input.serverState)})
      );
    </script>
  </body>
  </html>
`;
