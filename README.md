<p align="center">
    <img 
        height="100px"
        width="100px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/peko/main/examples/preact/src/assets/twemoji_chicken.svg" alt="chicken" 
    />
</p>
<h1 align="center">Peko</h1>
<p><strong>
    🐔🦕 The Featherweight Deno Library for Modern JS Apps. 🌏
</strong></p>

<p>
    Serve around the world effortlessly with Deno Deploy!
</p>

<a href="https://doc.deno.land/https://deno.land/x/peko@v0.1.1/mod.ts">API DOCS</a>

<h2>Summary</h2>
<ul>
    <li>
        <strong>First-class frontend</strong> - server-side render then rapidly hydrate with preloaded JS modules (~10kb Preact example).
    </li>
    <li>
        <strong>Production-ready backend</strong> - reliablility and performance with Typescript and configurable page caching.
    </li>
    <li>
        <strong>Software minimalism</strong> - no build-step, just a sleek runtime using only the Deno std library.
    </li>
    <li>
        <strong>Ease of adoption</strong> - intuitive functions & zero fixed project structure.
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
        <code>$ deno run --allow-net --allow-env --allow-read --watch examples/preact/app.js</code>
    </li>
    <li>
        Edit <code>./examples/preact/src</code> for frontend changes and play with <code>./examples/preact/app.js</code> for app server logic.
    </li>
</ol>
<br />
<h3>Import Peko into your own project:</h3>
<p><code>import * as peko from "https://deno.land/x/peko/mod.ts"</code></p>
<br />
<p>
    <strong>Note: <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html">Lit-html</a></strong> VS Code plugin recommended if using HTM & Preact.
</p>

<h2>Deployment</h2>
<p>Docker & Deno Deploy deployment guides coming soon!</p>
<p>
    <strong>This project aims to be ready for production soon but it is not complete with extensive testing yet! Use at your own risk.</strong>
</p>

<h2>How does it work?</h2>
<p>
    Deno http server receives page requests and renders your frontend source modules to HTML. The Preact example codebase uses <a href="https://preactjs.com">Preact</a> UI components and <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a> for Server-Side Rendering (SSR). The HTML is injected into an HTML template along with any custom defined tags and request metadata before being served to the user's browser client.
</p>
<p>
    If <code>env.ENVIRONMENT === "production"</code> page renders are also cached so subsequent requests can be served instantly until the page's configurable cache lifetime is reached.
</p>
<h2>Why is this cool?</h2>
<p>
    Because it provides all of the SEO and UX benefits of SSR with no JavaScript transpilation or bundling required - the server and browser use the exact same code! This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity of development.
</p>
<p>
    Better yet, Peko is not build for any specific frontend framework or library. You can use React, Preact, Vue... you name it! Simply plug your rendering function into Peko's SSRRoute data along with a URL for the root module of your app and add the client-side hydration logic to your HTML template.
</p>
<p>
    Note: Your root app component must be exported as default.
</p>
<p>
    It is all possible because of the unique combination of powerful new JavaScript tools. Deno, unlike Node.js, is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript and vice versa which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like Preact combined with <a href="https://github.com/developit/htm">htm</a> offer lightning fast client-side hydration with a transpiler-free JavaScript markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and a standard library full of great tools as well as a passionate community supporting it.
</p>

<h2>Differences between other frameworks like Next.js, etc.</h2>
<p>
    Peko is built with one radical design decision: it isn't built to support the infinite universe of npm packages (as these often require bundling and transpilation). This is a deliberate step away from the inflated state that many modern web applications find themselves in. Just make sure your source modules can run directly in the browser without transpilation!
</p>
