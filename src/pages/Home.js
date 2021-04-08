import { html } from "https://cdn.skypack.dev/htm/preact"

import Layout from "../layouts/Layout.js"

const Home = () => {
    return html`
        <${Layout} navColor="palegreen">
            <h1>Beko</h1>
            <p>
                The featherweight full-stack webapp framework. Built with <a href="https://deno.land">Deno</a>, <a href="https://deno.land/x/denon">Denon</a>, <a href="https://preactjs.com">Preact</a> and <a href="https://github.com/developit/htm">htm</a> 💖
            </p>

            <h2>How does it work?</h2>
            <p>
                Deno http server receives page requests and renders Preact (+ htm) page components to HTML using <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a>. The HTML is injected into an HTML template along with request metadata, CSS and some JavaScript before being served to the user's client.
            </p>
            <p>
                The client-side JavaScript then imports the page's source module (or an optimised production <a href="https://deno.land/manual/tools/bundler">bundle</a>) for page hydration (credit to htm here for giving us browser-friendly JavaScript markup) and Voilà, we have a webapp.
            </p>

            <h2>Why is this cool?</h2>
            <p>
                Because it provides all of the SEO and UX benefits of Server-Side Rendering (SSR) with no JavaScript transpilation or bundling required - the server and browser use the exact same code!
            </p>
            <p>
                This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity of development.
            </p>
            <p>
                It is all possible because of a combination of powerful tools. First and foremost is Deno, it is built to the ECMAScript specification which makes it compatible with browser JavaScript (the support for URL imports was the inspiration for this project!). On top of this Deno also has a rich runtime API, a standard library full of great tools and a passionate community supporting it.
            </p>
            <p>
                
            </p>

            <h2>Production / Development mode</h2>
            <p>
                <strong>Production mode</strong>, a JavaScript bundle is created for each page and page renders are cached on request (in Redis service created via docker-compose.yml) with a configurable lifetime for optimal service.
            </p>
            <p>
                <strong>Development mode</strong>, source files are served directly to the browser for easy debugging. The DevSocket route is created and called by the client which triggers a reload in the browser when Denon file watcher restarts the Deno process.
            </p>

            <h2>More Awesome features:</h2>
            <ul>
                <li><strong>Featherweight apps</strong> - default settings result in less than 100MB production image builds & less than 5kb of external modules used in browser (with subsequent loads utilizing module caching for instant loads).</li>
                <li><strong>CSS handling</strong> - css files in /src are bundled into the html template (for non-global component styles use inline css in the component's js file).</li>
                <li><strong>useLocalState</strong> - syncs app state to localStorage, useful for sharing state across components or preserving it across user sessions and hot-reloads.</li>
            </ul>

            <h2>Getting started:</h2>
            <ol>
                <li>
                    <a href="https://deno.land/manual/getting_started/installation">Install Deno</a>
                </li>
                <li>
                    <a href="https://deno.land/manual/getting_started/installation">Install Denon</a> - make sure to add to PATH (use provided export command for MacOS)
                </li>
                <li>
                    Start development server: <code>$ denon start</code>
                </li>
                <li>
                    Edit /src files for frontend changes. Add new /routes and /middlewares in /lib for backend changes.
                </li>
            </ol>

            <h2>Deployment</h2>
            <p>
                Dockerfile is preconfigured for production. For local testing run: <code>$ docker-compose up</code><br />
                Note: You may want to use <code>--renew-anon-volumes</code> flag to clear redis cache.
            </p>
            <p>
                <strong>This project aims to be ready for production soon but it is not complete with extensive testing yet! Use at your own risk.</strong>
            </p>
        </${Layout}>
    `
}

export default Home