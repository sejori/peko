import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../layouts/Layout.js"

const Home = (props) => {
    return html`
        <${Layout} navColor="limegreen">
            <h1 style="text-align: center;">Peko</h1>
            <p style="text-align: center;"><strong>
                🐔 Featherweight & Flexible SSR Toolkit for Modern JS Apps. Built with Deno 🦕 
            </strong></p>

            <p style="text-align: center;">
                Serve the world easily with <a href="https://deno.com/deploy">Deno Deploy</a>! 🌏
            </p> 

            <p><a href="https://doc.deno.land/https://deno.land/x/peko@v0.1.2/mod.ts">API DOCS</a></p>

            <p>Time of server request: <strong>${props.server_time}</strong></p>
            <p>Time of latest render: <strong>${Date.now()}</strong> ${"<"}- changes with hydration!</p>

            <h2>Summary</h2>
            <ul>
                <li>
                    <strong>First-Class Frontend</strong> - Server-Side Render then Hydrate the client with src modules or bundles.
                </li>
                <li>
                    <strong>Production-Ready Backend</strong> - Reliable and performant with TypeScript and configurable Response caching.
                </li>
                <li>
                    <strong>Software Minimalism</strong> - No build-step, just a sleek runtime using only the Deno std library.
                </li>
                <li>
                    <strong>Ease of Adoption</strong> - Intuitive API & no enforced UI library or directory structure.
                </li>
            </ul>

            <h2>Getting started</h2>
            <ol>
                <li>
                    <a href="https://deno.land/manual/getting_started/installation">Install Deno</a>
                </li>
                <li>
                    <code>$ git clone https://github.com/sebringrose/peko.git</code>
                </li>
                <li>
                    <code>$ cd peko</code>
                </li>
                <li>
                    <code>$ deno run --allow-net --allow-env --allow-read --watch examples/preact/app.ts</code>
                </li>
                <li>
                    Edit <code>./examples/preact/src</code> for frontend changes and play with <code>./examples/preact/app.ts</code> for app server logic.
                </li>
            </ol>
            <h3>Import Peko into your own project:</h3>
            <p><code>import * as peko from "https://deno.land/x/peko/mod.ts"</code></p>
            <br />
            <p>
                <strong>Note: <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html">Lit-html</a></strong> VS Code plugin recommended if using HTM & Preact.
            </p>
        </${Layout}>
    `
}

export default Home