import { html } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

import Layout from "../layouts/Layout.js"

const Home = () => {
    return html`
        <${Layout} navColor="limegreen">
            <h1>Peko</h1>
            <p><strong>
                The featherweight & UI-library-agnostic SSR toolkit for Deno.
            </strong></p>
            <p>No bundling or build process. Server & Browser share all source modules!</p>
            <p><span style="text-decoration: underline;">${Date.now()}</span> ${"<-"} refresh to see the initial server rendered value get hydrated</p>

            <h2>Summary</h2>
            <ul>
                <li>
                    <strong>First-class frontend</strong> - server-side rendered then rapidly hydrated with preloaded JS modules (~10kb in Preact example).
                </li>
                <li>
                    <strong>Production-ready backend</strong> - reliablility and performance with TypeScript and configurable page caching.
                </li>
                <li>
                    <strong>Software minimalism</strong> - zero build-time technologies or bloated node_modules (&lt;80MB Docker images).
                </li>
                <li>
                    <strong>Ease of adoption</strong> - intuitive service functions & no enforced directory structure.
                </li>
            </ul>
            <p>
                Read on, star/fork/clone away and feel free to contribute any ideas!
            </p>

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
                    <code>$ deno run --allow-env --allow-read --allow-net --watch examples/preact/app.js</code>
                </li>
                <li>
                    Check out <code>./examples/preact/src</code> for frontend code and play around with <code>./examples/preact/app.js</code> for app server changes.
                </li>
            </ol>
            <br />
            <h3>Import Peko into your own Deno project:</h3>
            <p><code>import Peko from "https://github.com/sebringrose/peko/mod.ts"</code></p>
            <p>
                <strong>Note: <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html">Lit-html</a></strong> VS Code plugin can be helpful if using Preact & HTM.
            </p>

            <h2>Deployment</h2>
            <p>Docker & Deno Deploy deployment guides coming soon!</p>
            <p>
                <strong>This project aims to be ready for production soon but it is not complete with extensive testing yet! Use at your own risk.</strong>
            </p>

            <h2>How does it work?</h2>
            <p>
                Deno http server receives page requests and renders your source UI library modules to HTML. The example uses <a href="https://preactjs.com">Preact</a> UI components and <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a> for Server-Side Rendering (SSR). The HTML is injected into an HTML template along with configurable CSS, JS & metadata before being served to the user's browser.
            </p>
            <p>
                If <code>env.ENVIRONMENT === "production"</code> page renders are also cached so that subsequent requests can be served immediately without a server-side render step (until the page's configurable cache lifetime is reached).
            </p>
            <h2>Why is this cool?</h2>
            <p>
                Because it provides all of the SEO and UX benefits of SSR with no JavaScript transpilation or bundling required - the server and browser use the exact same code! This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity of development.
            </p>
            <p>
                It is all possible because of the unique combination of powerful new JavaScript tools. Deno, unlike Node.js, is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript and vice versa which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like Preact combined with <a href="https://github.com/developit/htm">htm</a> offer lightning fast client-side hydration with a transpiler-free JavaScript markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and a standard library full of great tools as well as a passionate community supporting it.
            </p>

            <h2>Differences between other frameworks like Next.js, etc.</h2>
            <p>
                Peko is built with one radical design decision: it doesn't support the extended universe of NPM packages (as these often require bundling and transpilation). This is a deliberate step away from the inflated state that many modern web applications find themselves in. You can of course still use external packages and modules - just make sure your source can run in the browser without transpilation!
            </p>
        </${Layout}>
    `
}

export default Home