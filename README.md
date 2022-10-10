<p align="center">
    <img 
        height="100px"
        width="100px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/peko/main/examples/preact/src/assets/twemoji_chick.svg" alt="peko-chick" 
    />
</p>
<h1 align="center">Peko</h1>

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
    <span>
        &nbsp;
        <a href="#events">
            Events
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
        <strong>First-class frontend</strong> - Designed for server-side-rendering, use your library of choice! 
    </li>
    <li>
        <strong>Production-ready backend</strong> - Typescript server class along with all the utilities you need.
    </li>
    <li>
        <strong>Software minimalism</strong> - Sleek runtime with no build step. Uses only the Deno <a href="https://deno.land/std">std</a> library.
    </li>
    <li>
        <strong>Ease of adoption</strong> - Intuitive API, lots of examples and no fixed project structure.
    </li>
</ul>
<p>
    Any feature suggestions or code reviews are very welcome!
</p>

<h2>Get started</h2>
<a href="https://github.com/sebringrose/peko/blob/main/examples/auth/app.ts">
    <p>Deploy a secure and scalable webapp from one file 🧑‍💻🌠</p>
</a>

<h3>Or try the example apps:</h3>
<ol>
    <li>
        <p><a href="#cool">Deno is sick.</a> <a href="https://deno.land/manual/getting_started/installation">Install it.</a></p>
    </li>
    <li>
        <code>$ git clone https://github.com/sebringrose/peko.git</code>
    </li>
    <li>
        <code>$ cd peko/examples</code>
    </li>
    <li>
        <code>$ deno task start:dev</code>
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

<h2 id="#routing">Routing</h2>
<p>
    Requests are matched to a mutable array of <a href="https://doc.deno.land/https://deno.land/x/peko/lib/server.ts/~/Route">Routes</a>. Routes can be added or removed at runtime via the <code>addRoute</code> and <code>removeRoute</code> exports.
</p>

<h2 id="request-handling">Request handling</h2>
<p>
    The included <code>staticHandler</code>, <code>ssrHandler</code> and <code>sseHandler</code> serve static assets, render JavaScript apps and stream server-sent events respectively. There are also authentication, logging and caching middleware. Of course, you can also create your own middleware or handlers and plug them into your routes (see <code>examples/custom-handler</code>).
</p>

<h2 id="response-caching">Response caching</h2>
<p>
    In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. Peko provides a <code>ResponseCache</code> utility to create caches and memoize functions with them. The cache middleware does this so that Requests can be served from the cache and not unecessarily rerendered (Response cache is indexed by serialized <a href="https://doc.deno.land/https://deno.land/x/peko/lib/server.ts/~/Render">RequestContext</a>).
</p>
<p>
    <strong>Tip:</strong> Caching Responses from external data services helps keep your app fast and reduce network overhead in serving Requests!
</p>

<h2 id="#events">Events</h2>
<p>
    Realtime apps can be built with <a href="https://doc.deno.land/https://deno.land/x/peko/lib/utils/emitter.ts/~/Event">Events</a>. Events are created by <a href="https://doc.deno.land/https://deno.land/x/peko/lib/utils/emitter.ts/~/Emitter">Emitters</a> via the <code>.emit</code> method. Emitters can be subscribed to manually <code>Emitter.subscribe</code> or given to the <code>sseHandler</code> to stream Event data to connected clients (see <code>examples/sse</code>).
</p>

<h2 id="cool">This is cool...</h2>
<p>
    Because it provides all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling required - the server and browser can use the exact same code. This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity.
</p>
<p>
    Better yet, Peko is not build for any specific frontend framework or library. You can use React, Preact, Vue... you name it (if you do set up a React or Vue project please consider adding it to the examples ❤️). Simply plug your app-rendering logic into the <a href="https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts/~/Render">Render</a> function of an <a href="https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts/~/SSRRoute">SSRRoute</a>.
</p>
<p>
    Peko is made possible by powerful new JavaScript tools. Deno is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like Preact combined with <a href="https://github.com/developit/htm">htm</a> offer lightning fast client-side hydration with a browser-friendly markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and loads of community tools for your back-end needs.
</p>

<p>This project started out of excitement for the elegancy of Deno and the freedom it would bring to the JavaScript community. At time of writing all library code has been written and maintained by me. If you are interested in contributing please submit a PR or get in contact.</p>
