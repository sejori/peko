<p align="center">
    <img 
        height="100px"
        width="100px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/peko/main/examples/preact/src/assets/twemoji_chicken.svg" alt="chicken" 
    />
</p>
<h1 align="center">Peko</h1>
<p align="center"><strong>
    🪶 Featherweight toolkit for the modern <a href="https://deno.com/deploy">stateless web</a> 🦕 
</strong></p>

<p align="center">
    <span>
        &nbsp;
        <a href="#routing">
            Routing
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="#events">
            Events
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="#request-handling">
            Request handling
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="#response-caching">
            Response caching
        </a>
        &nbsp;
    </span>
</p>

<p align="center">
    <a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">
        API DOCS
    </a>
</p>

<h2>Philosophy</h2>
<ul>
    <li>
        <strong>First-class frontend</strong> - Server-side render and client-side hydrate with the same code, no enforced tooling. 
    </li>
    <li>
        <strong>Production-ready backend</strong> - TypeScript, Response caching (+ <a href="https://github.com/sebringrose/peko/issues">more soon</a>).
    </li>
    <li>
        <strong>Software minimalism</strong> - Sleek runtime with no build step. Uses only the Deno <a href="https://deno.land/std">std</a> library.
    </li>
    <li>
        <strong>Ease of adoption</strong> - Intuitive API, lots of examples and no fixed project structure.
    </li>
</ul>
<p>
    Read on, please star/fork/clone, and any feature suggestions or code reviews are very welcome!
</p>

<h2>Get started</h2>
<h3>Build and launch a secure and scalable webapp from one file.</h3>

<h3>Try the example apps:</h3>
<ol>
    <li>
        <p><a href="#cool">Deno is sick.</a> <a href="https://deno.land/manual/getting_started/installation">Install it.</a></p>
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
</ol>
<p>
    <strong>Note: <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html">Lit-html</a></strong> VS Code plugin recommended if using HTM & Preact.
</p>

<h3>Otherwise: <code>import * as Peko from "https://deno.land/x/peko/mod.ts"</code></h3>

<h2>Deployment</h2>

| Example        | Deno Deploy | Docker |
|   ---          |     ---     |   ---  |
| Preact         |     ✅      |    ✅   |
| Custom-handler |     ✅      |    ✅   |
| Eta-templating |     ❌      |    ✅   |
| Vue            |     ❌      |    ❌   |

<p>
    <strong>This project aims to be ready for production soon but it is not complete with extensive testing yet! Use at your own risk.</strong>
</p>

<h2 id="#routing">Routing</h2>
<p>
    Requests are matched to a mutable array of <a href="https://doc.deno.land/https://deno.land/x/peko/lib/server.ts/~/Route">Routes</a>. Routes can be added or removed at runtime via the <code>addRoute</code> and <code>removeRoute</code> exports.
</p>

<h2 id="#events">Events</h2>
<p>
    Realtime apps can be built with <a href="https://doc.deno.land/https://deno.land/x/peko/lib/utils/emitter.ts/~/Event">Events</a>. Events are created by <a href="https://doc.deno.land/https://deno.land/x/peko/lib/utils/emitter.ts/~/Emitter">Emitters</a> via the <code>.emit</code> method. Emitters can be subscribed to manually <code>Emitter.subscribe</code> or given to the <code>sseHandler</code> to stream Event data to connected clients (see <code>examples/sse</code>).
</p>

<h2 id="request-handling">Request handling</h2>
<p>
    The included <code>staticHandler</code>, <code>ssrHandler</code> and <code>sseHandler</code> serve static assets, render JavaScript apps and stream server-sent events respectively. There are also premade <code>addStaticRoute</code>, <code>addSSRRoute</code> and <code>addSSERoute</code> exports that implement their respective handlers. Of course, you can also create your own handlers plug them into a basic Route (see <code>examples/custom-handler</code>).
</p>

<h2 id="response-caching">Response caching</h2>
<p>
    In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. Peko provides a <code>createResponseCache</code> utility export to create caches and memoize functions to them. The <code>addSSRRoute</code> export does this with the <code>ssrHandler</code> so that Requests can be served from the cache and not unecessarily rerendered (Response cache is indexed by serialized <a href="https://doc.deno.land/https://deno.land/x/peko/lib/server.ts/~/Render">RequestContext</a>).
</p>
<p>
    <strong>Tip:</strong> Caching Responses from external data services helps keep your app fast and reduce network overhead in serving Requests!
</p>
<p>
    <strong>Note:</strong> <code>addSSRRoute</code> only caches Responses when <code>config.devMode === false</code> (which is the default config). It is recommended to use the <code>setConfig</code> export to set <code>devMode</code> from an environment variable (see <code>examples/config.ts</code>).
</p>

<h2 id="cool">This is cool...</h2>
<p>
    Because it provides all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling required - the server and browser can use the exact same code. This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity.
</p>
<p>
    Better yet, Peko is not build for any specific frontend framework or library. You can use React, Preact, Vue... you name it (if you do set up a React or Vue project please consider adding it to the examples ❤️). Simply plug your app-rendering and HTML-templating logic into the <a href="https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts/~/Render">Render</a> function of an <a href="https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts/~/SSRRoute">SSRRoute</a>.
</p>
<p>
    Peko is made possible by powerful new JavaScript tools. Deno is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like Preact combined with <a href="https://github.com/developit/htm">htm</a> offer lightning fast client-side hydration with a browser-friendly markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and loads of community tools for your back-end needs.
</p>

<h2>Differences between Next.js, etc.</h2>
<p>
    Peko is built with one radical design decision: no build-step (i.e. no Webpack, no Babel). That means frontend modules must run in the server and browser as source if you want to utilize server-side rendering. You can still use component libraries and other node packages if you import their compiled module distributions. This is all a deliberate step away from the inflated state that many web applications find themselves in... it’s 2022.
</p>
