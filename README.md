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
     🐔 Featherweight & Flexible SSR Toolkit for Modern JS Apps. Built with Deno 🦕 
</strong></p>

<p align="center">
    Serve the world easily with <a href="https://deno.com/deploy">Deno Deploy</a>! 🌏
</p> 

<a align="center" href="https://doc.deno.land/https://deno.land/x/peko@v0.1.2/mod.ts"><p>API DOCS</p></a>

<h2>Summary</h2>
<ul>
    <li>
        <strong>First-Class Frontend</strong> - Server-Side Render then Hydrate the client with src modules or bundles.
    </li>
    <li>
        <strong>Production-Ready Backend</strong> - Reliable and performant with TypeScript and configurable Response caching.
    </li>
    <li>
        <strong>Software Minimalism</strong> - No build-step, just a sleek runtime using only the Deno std library.
    </li>
    <li>
        <strong>Ease of Adoption</strong> - Intuitive API & no enforced UI library or directory structure.
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
        <code>$ deno run --allow-net --allow-env --allow-read --watch examples/preact/app.ts</code>
    </li>
    <li>
        Edit <code>./examples/preact/src</code> for frontend changes and play with <code>./examples/preact/app.ts</code> for app server logic.
    </li>
</ol>
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
    Deno http server receives HTTP requests and matches them to your defined app routes. If a route with matching HTTP path and url is found, the route's middleware function is run followed by the handler function. 
</p> 
<p>
    Peko contains premade Server-Side Rendering (SSR) and Static Asset handlers that can be easily accessed using <code>Peko.addStaticRoute</code> or <code>Peko.addSSRRoute</code>. The Preact example codebase uses <a href="https://preactjs.com">Preact</a> UI components with <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a> and a simple HTML Document Template Literal for SSR. 
</p>
<p>
    Advanced templating can be done with <a href="https://github.com/eta-dev/eta">eta</a> - take a look at <code>/examples/eta-templating</code>. Or for an example of a custom SSR handler that implements Peko's internal Response caching system have a look at <code>/examples/custom-ssr</code>!
</p>
<p>
    Caching only enabled if <code>config.devMode == false</code>. You can manually edit the config using <code>Peko.setConfig({ ... })</code> or keep the default but set <code>env.ENVIRONMENT = "production"</code> to test caching locally.
</p>
<p>
    Note: <code>Peko.addSSRRoute({ ... })</code> is the only route function that implements caching by default.
</p>
<h2>Why is this cool?</h2>
<p>
    Because it provides all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling required - the server and browser use the exact same code! This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity of development.
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
