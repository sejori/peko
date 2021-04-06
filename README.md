# Velocireno - a simple, monolithic web application framework for Deno.

<h1>The epic union of Deno 🦕 & Preact ⚛️</h1>
<h2>How does it work?</h2>
<p>A Deno http server renders the <a href="https://preactjs.com">Preact</a> (+ <a href="https://github.com/developit/htm">htm</a>) page components to HTML using <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a>. The HTML is then injected into an HTML template along with request metadata, CSS and some JavaScript.</p>
<p>The client-side JavaScript imports Preact (via <a href="https://www.skypack.dev">SkyPack</a>) and the page's source module for client-side hydration. And Voilà, we have a webapp.</p>
<h2>Why is this cool?</h2>
<p>Because there is no code bundling or transpilation required - the server and browser use the exact same code!</p>
<p>By importing ES modules via a CDN like Skypack we leverage module caching in Deno and the browser for simple and speedy development.</p>
<p>When configured for a production environment bundles are generated for each page so the user gets all the JavaScript they need in one optimal request.</p>
<h2>Awesome features:</h2>
<ul>
    <li><strong>Server-side rendering</strong> - boost SEO and UX with instant content.</li>
    <li><strong>Featherweight apps</strong> - only default external modules are preact and htm, totalling less than 5kb combined.</li>
    <li><strong>Hot-reloading</strong> - smooth DX with in-built devSocket, notifies browsers of src changes and triggers a reload (only used when ENVIRONMENT=development in .env file).</li>
    <li><strong>CSS handling</strong> - css files present in src directory are bundled into html template (for non-global component styles use inline css in the component's js file).</li>
    <li><strong>useLocalState</strong> - hook for syncing state to localStorage, helpful for sharing state between components and preserving across user sessions and hot-reloads.</li>
</ul>

## Commands:

Start: `$ deno run --allow-net --allow-read --allow-env --unstable lib/server.js`