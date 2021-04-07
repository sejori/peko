<p align="center">
    <img 
        height="100px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/velocireno/main/src/assets/twemoji_chicken.svg" alt="chicken" 
    />
</p>
<h1 align="center">Velocireno</h1>
<p>
    A simple, monolithic web application framework for Deno. Made possible by the epic union of <a href="https://deno.land">Deno</a>, <a href="https://preactjs.com">Preact</a> and <a href="https://github.com/developit/htm">htm</a> 💖
</p>

<h2>How does it work?</h2>
<p>
    A Deno http server receives page requests and renders Preact (+ htm) page components to HTML using <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a>. The HTML is injected into an HTML template along with request metadata, CSS and some JavaScript before being served to the user's client.
</p>
<p>
    The client-side JavaScript then imports the page's source module (or an optimised production <a href="https://deno.land/manual/tools/bundler">bundle</a>) for page hydration (credit to htm here for giving us browser-friendly JavaScript markup) and Voilà, we have a webapp.
</p>

<h2>Why is this cool?</h2>
<p>
    Because it provides all of the SEO and UX benefits of Server-Side Rendering (SSR) with no JavaScript transpilation or bundling required - the server and browser use the exact same code!
</p>
<p>
    This completely eliminates part of the traditional toolchain, increasing project maintainability and simplicity of development.
</p>
<p>
    It is all possible because of a combination of powerful tools. First and foremost is Deno, it is built to the ECMAScript specification which makes it compatible with browser JavaScript (the support for URL imports was the inspiration for this project). On top of this Deno also has a rich runtime API, a standard library full of great tools and a passionate community supporting it.
</p>
<p>
    
</p>

<h2>Production / Development mode</h2>
<p>
    <strong>Production mode</strong>, a JavaScript bundle is created for each page and page renders are cached on request with a configurable lifetime for optimal service.
</p>
<p>
    <strong>Development mode</strong>, source files are served directly to the browser for easy debugging. The DevSocket route is created which runs a file watcher to trigger a reload in the browser and restart the Deno process on file changes.
</p>

<h2>More Awesome features:</h2>
<ul>
    <li><strong>Featherweight apps</strong> - No inflated 3rd-party libraries on the server and the only external modules used in the client are preact and htm, totalling less than 5kb combined.</li>
    <li><strong>CSS handling</strong> - css files in /src are bundled into the html template (for non-global component styles use inline css in the component's js file).</li>
    <li><strong>useLocalState</strong> - syncs app state to localStorage, useful for sharing state across components or preserving it across user sessions and hot-reloads.</li>
</ul>

## Commands:

Start (prod): `$ deno run --allow-net --allow-read --allow-write --allow-env --allow-run --unstable lib/server.js`

Start (dev): `$ deno run --allow-net --allow-read --allow-env --allow-run --unstable lib/server.js`