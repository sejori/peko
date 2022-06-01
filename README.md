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
    🪶 Featherweight toolkit for the <a href="https://tinyclouds.org/javascript_containers">modern stateless web</a>. Built with Deno! 🦕 
</strong></p>

<p align="center">
    Serve the world with <a href="https://deno.com/deploy">Deno Deploy</a>! 🌏
</p> 

<p align="center">
    <a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">
        API DOCS
    </a>
</p>

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

<h2>Philosophy</h2>
<ul>
    <li>
        <strong>First-class frontend</strong> - Server-side render (SSR) and client-side hydrate with the same code. Bundling optional.
    </li>
    <li>
        <strong>Production-ready backend</strong> - TypeScript, customizable Response caching and a library of utilities.
    </li>
    <li>
        <strong>Software Minimalism</strong> - No build-step, just a sleek runtime using only the Deno <a href="https://deno.land/std">std</a> library.
    </li>
    <li>
        <strong>Ease of Adoption</strong> - Intuitive API, no frontend tool lock-in and no forced project structure.
    </li>
</ul>
<p>
    Read on, star/fork/clone away and feel free to contribute any ideas!
</p>

<h2>Get started</h2>
<h3>Build and launch a secure and feature-rich webapp in one file.</h3>

<h3>OR try the examples:</h3>
<ol>
    <li>
        <p><a href="#cool"Deno is sick. Install it.</p>
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
</ol>
<p>
    <strong>Note: <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html">Lit-html</a></strong> VS Code plugin recommended if using HTM & Preact.
</p>

<h3>OR Import Peko into your own project:</h3>
<p><code>import * as Peko from "https://deno.land/x/peko/mod.ts"</code></p>
<p>And if you want to use Peko's types:</p>
<p><code>import { ... } from "https://deno.land/x/peko/lib/types.ts"</code></p>

<h2>Deployment</h2>

| Example        | Deno Deploy | Docker |
|   ---          |     ---     |   ---  |
| Preact         |     ✅      |    ✅   |
| Custom-ssr     |     ✅      |    ✅   |
| Eta-templating |     ❌      |    ✅   |
| Vue            |     ❌      |    ❌   |

<p>
    <strong>This project aims to be ready for production soon but it is not complete with extensive testing yet! Use at your own risk.</strong>
</p>

<h2 id="#routing">Routing</h2>
<p>
    Http Requests are matched to a mutable array of <a href="https://doc.deno.land/https://deno.land/x/peko@v0.2.0/lib/types.ts/~/Route">Routes</a>. Routes can be added or removed at runtime via the <code>addRoute(route: Route)</code> and <code>removeRoute(route: `/${string}`)</code> exports.
</p>

<h2 id="#events">Events</h2>
<p>
    Realtime app logic can be built with <a href="https://doc.deno.land/https://deno.land/x/peko@v0.2.0/lib/types.ts/~/Event">Events</a>. Events are created by <a href="https://doc.deno.land/https://deno.land/x/peko@v0.2.0/lib/types.ts/~/Emitter">Emitters</a> via the <code>.emit(event: Event)</code> method. Emitters can be subscribed to manually <code>Emitter.subscribe(listener: Listener)</code> or given to the <code>sseHandler(data: SSERoute)</code> to send Event data to connected clients (see <code>examples/sse</code>).
</p>

<h2 id="request-handling">Request handling</h2>
<p>
    The included <code>staticHandler</code>, <code>ssrHandler</code> and <code>sseHandler</code> serve static assets, render JavaScript apps and stream server-sent events respectively. There are premade <code>addStaticRoute(data: StaticRoute)</code>, <code>addSSRRoute(data: SSRRoute)</code> and <code>addSSERoute(data: SSERoute)</code> exports that implement their respective handlers but you can also import the handlers for custom logic if needed (see <code>examples/custom-ssr</code>).
</p>

<h2 id="response-caching">Response caching</h2>
<p>
    In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. The <code>addSSRRoute</code> export uses the <code>createResponseCache()</code> utility export to memoize the <code>ssrHandler</code> so that Requests can be served from the cache and not unecessarily rerendered.
</p>
<p>
    Caching Responses from external data services helps keep your app fast and reduce network overhead in serving Requests!
</p>
<p>
    <strong>Note:</strong> <code>addSSRRoute(data: SSRRoute)</code> only utilizes a cache when <code>config.devMode === false</code> (which is the default config). It is recommended to use the <code>setConfig(conf: Partial<Config>)</code> export to set <code>devMode</code> from an environment variable (see <code>examples/config.ts</code>).
</p>

<h2 id="cool">This is cool...</h2>
<p>
    Because it provides all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling required - the server and browser use the exact same code! This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity.
</p>
<p>
    Better yet, Peko is not build for any specific frontend framework or library. You can use React, Preact, Vue... you name it. Simply plug your rendering function into an SSRRoute along with the client-side hydration logic to be injected into your HTML template (if you need it).
</p>
<p>
    It is all possible because of the unique combination of powerful new JavaScript tools. Deno, unlike Node.js, is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript and vice versa which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like Preact combined with <a href="https://github.com/developit/htm">htm</a> offer lightning fast client-side hydration with an ES6-friendly markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and a standard library full of great tools as well as a passionate community supporting it.
</p>

<h2>Differences between Next.js, etc.</h2>
<p>
    Peko is built with one radical design decision: it isn't built to support the infinite universe of npm packages (as these often require heavy build processes). This is a deliberate step away from the inflated state that many modern web applications find themselves in. Just make sure your frontend modules can run in the browser and you're golden!
</p>
