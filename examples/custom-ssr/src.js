import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "./Layout.js"

const Home = ({ server_time }) => {
    return html`
        <${Layout} navColor="limegreen">
            <h1>Peko</h1>
            <p><strong>
            The Featherweight Deno Library for Modern JS Apps.
            </strong></p>
            <p>No bundling or build process. Server & Browser share all source modules!</p>
            
            <p>Time of server request: <strong>${server_time}</strong></p>
            <p>Time of latest render: <strong>${Date.now()}</strong> ${"<"}- changes with hydration!</p>

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
                    <code>$ deno run --allow-env --allow-read --allow-net --watch examples/preact/server.js</code>
                </li>
                <li>
                    Check out <code>./examples/preact/src</code> for frontend code and play around with <code>./examples/preact/app.js</code> for app server changes.
                </li>
            </ol>
            <br />
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