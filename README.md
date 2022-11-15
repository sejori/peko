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
        <a href="#events">
            Server
        </a>
        &nbsp;
    </span>
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
</p>

<p align="center">
    <a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">
        API DOCS
    </a>
</p>

<h2>Philosophy</h2>
<ul>
    <li>
        <strong>Client-edge synergy</strong> - Share modules for JIT server rendering, consistent data and easy maintenance.
    </li>
    <li>
        <strong>Production-ready backend</strong> - Cascading middlware, auth utils and more, all tested.
    </li>
    <li>
        <strong>Software minimalism</strong> - Built with native JS APIs and Deno <a href="https://deno.land/std">std</a> library only.
    </li>
    <li>
        <strong>Ease of adoption</strong> - Intuitive server API with no file-system routing.
    </li>
</ul>
<p>
    Any feature suggestions or code reviews are very welcome!
</p>

<h2>Get started</h2>
<a href="https://github.com/sebringrose/peko/blob/main/examples/auth/app.ts">
    <p>A secure and scalable webapp in one file 🧑‍💻🌠</p>
</a>

<h3>Try the examples:</h3>
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

<h3>Import to your project:</h3>
<p><code>import * as Peko from "https://deno.land/x/peko/mod.ts"</code></p>
<p>and if you don't want unnecessary utitlies:</p>
<p><code>import { Server } from "https://deno.land/x/peko/server.ts"</code></p>

<h2>Deployment</h2>

Instantly deploy from GitHub with <a href="https://dash.deno.com/projects">Deno Deploy</a> (deploy the auth or preact examples if you fancy it 💖).

<h2>Overview</h2>
<h3 id="#server">Server</h3>
<p>
    The <a href="https://deno.land/x/peko/server.ts">Server</a> is the main class of Peko. It wraps Deno's <a href="https://deno.land/std/http/server.ts">std/serve</a> and holds all route and middleware data for request handling. <code>Server.use</code> can be used to add global middleware like the popular Express and Koa frameworks. The <code>server.logging</code> function can also be overwritten for remote logging.
</p>

<h3 id="#routing">Routing</h3>
<p>
    Requests are matched to a mutable array of <a href="https://doc.deno.land/https://deno.land/x/peko/server.ts/~/Route">Routes</a>. Routes can be added or removed at runtime via <code>addRoute</code> or <code>addRoutes</code>, and <code>removeRoute</code> or <code>removeRoutes</code> server methods.
</p>

<h3 id="request-handling">Request handling</h3>
<p>
    Each route must have a <code>handler</code> function that generates a response as well as optional <code>method</code> and <code>middleware</code> properties. If no matching route is found for a request an empty 404 response is sent. If an error occurs in handling a request an empty 500 response is sent. Both of these behaviours can be overwritten with middleware.
</p>
<p>
    The included <code>staticHandler</code>, <code>ssrHandler</code> and <code>sseHandler</code> handlers can be plugged straight into a route and reduce boilerplate code for serving static assets, rendering client-side apps to html and streaming <a href="https://developer.mozilla.org/docs/Web/API/CustomEvent/CustomEvent">CustomEvents</a> for server-sent events respectively (see <code>/examples</code> for implementations). There are also authentication, logging and caching middleware. Of course, you can also create your own middleware or handlers and plug them into your routes (see <code>examples/custom-handler</code>).
</p>

<h3 id="response-caching">Response caching</h3>
<p>
    In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. Peko provides a <code>ResponseCache</code> utility for this. The <code>cacher</code> middleware wraps it and provides drop in response caching for your routes. The ResponseCache is indexed by serializing the incoming <a href="https://doc.deno.land/https://deno.land/x/peko/server.ts/~/RequestContext">RequestContext</a> and has a configurable cache item lifetime.
</p>

<h2 id="cool">The modern edge is cool because...</h2>
<p>
    The client-server gap practically disappears. We can have all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling. We can use modules and classes in the browser until users decide they want cloud compute. If we want TS source we can <a href="https://github.com/denoland/deno_emit">emit</a> JS versions of code. This completely eliminates part of the traditional JavaScript toolchain, increasing project maintainability and simplicity, all while making our software even faster.
</p>
<p>
    Better yet, Peko is not build for any specific frontend framework or library. You can use barebones HTML, React, Preact, Vue... you name it (if you do set up a React or Vue project please consider opening a PR to the examples). Simply plug your app-rendering logic into the <a href="https://deno.land/x/peko@v1.0.0/handlers/ssr.ts?s=Render">Render</a> function of an <a href="https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts">ssrHandler</a>.
</p>
<p>
    This is all made possible by powerful new JavaScript tools. Deno is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like <a href="https://github.com/preactjs/preact">Preact</a> combined with <a href="https://github.com/developit/htm">htm</a> offer lightning fast client-side hydration with a browser-friendly markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and loads of community tools for your back-end needs.
</p>

<p>This project started out of excitement for the elegancy of Deno and the freedom it would bring to the JavaScript community. If you are interested in contributing please submit a PR or get in contact :D</p>
