<p align="center">
    <img 
        height="100px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/peko/main/exampleSrc/assets/twemoji_chicken.svg" alt="chicken" 
    />
</p>
<h1 align="center">Peko</h1>
<p><strong>
    The featherweight & UI-library-agnostic SSR toolkit for Deno.
</strong></p>
<p>No bundling or build process. Server & Browser share all source modules!</p>

<h2>Summary</h2>
<ul>
    <li>
        <strong>First-class frontend</strong> - server-side rendered then rapidly hydrated with preloaded JS modules (~10kb in <code>./exampleSrc</code> dir).
    </li>
    <li>
        <strong>Production-ready backend</strong> - reliablility and performance with Typescript and configurable page caching.
    </li>
    <li>
        <strong>Software minimalism</strong> - zero build-time technologies or bloated node_modules (<80MB Docker images).
    </li>
    <li>
        <strong>Ease of adoption</strong> - easy-to-understand functions & no fixed project structure.
    </li>
    <li>
        <strong>Enjoyable development</strong> - Hot-reloading, localState hook in <code>exampleSrc</code> and utilise Deno & browser caching for offline editing!
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
        <code>$ deno run --allow-net --allow-env --allow-read --watch example.js</code>
    </li>
    <li>
        Edit <code>./exampleSrc</code> for frontend and play around with <code>./example.js</code> for backend server.
    </li>
</ol>
<br />
<h3>Import Peko into your own Deno project:</h3>
<p><code>import Peko from "https://github.com/sebringrose/peko"</code></p>
<br />
<p>
    <strong>Note: <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html">Lit-html</a></strong> VS Code plugin recommended if using HTM & Preact as per <code>exampleSrc</code>.
</p>

<h2>Deployment</h2>
<p>Docker & Deno Deploy deployment guides coming soon!</p>
<p>
    <strong>This project aims to be ready for production soon but it is not complete with extensive testing yet! Use at your own risk.</strong>
</p>

<h2>How does it work?</h2>
<p>
    Deno http server receives page requests and renders your source UI library modules to HTML. Example uses <a href="https://preactjs.com">Preact</a> UI components and <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a> for SSR. The HTML is injected into an HTML template along with configurable CSS, JS & metadata before being served to the user's browser client.
</p>
<p>
    If <code>env.ENVIRONMENT === "production"</code> page renders are also cached so subsequent requests can be served instantly until the page's configurable cache lifetime is reached.
</p>
<h2>Why is this cool?</h2>
<p>
    Because it provides all of the SEO and UX benefits of Server-Side Rendering (SSR) with no JavaScript transpilation or bundling required - the server and browser use the exact same code! This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity of development.
</p>
<p>
    It is all possible because of the unique combination of these powerful tools. Deno, unlike Node.js, is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript and vice versa which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). Preact offers lightning fast client-side hydration and <a href="https://github.com/developit/htm">htm</a> provides a transpiler-free JavaScript markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and a standard library full of great tools as well as a passionate community supporting it.
</p>

<h2>Differences between other frameworks like Next.js, etc.</h2>
<p>
    Peko is built with one radical design decision: it isn't built to support the npm/React universe. This is a deliberate step away from the inflated state that many modern web applications find themselves in. The example's use Preact but there's no reason you couldn't swap out the server render function for another SSR-enabled framework/library (e.g. Vue). Just make sure your source modules can run directly in the browser without transpilation!
</p>
<p>
    By using Preact and htm with no transpiler the Peko <code>exampleSrc</code> bridges the gap between old and new; by allowing the use of plain old HTML and CSS alongside JavaScript app components and state management (VDOM diffing). This means you can utilise your favourite CSS libraries and HTML templates/snippets in a modern JavaScript app but you won't have access to the endless pool of community-made React components (unless you add preact/compat as a dependency).
</p>
