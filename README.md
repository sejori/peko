<p align="center">
    <img 
        height="100px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/velocireno/main/src/assets/twemoji_chicken.svg" alt="chicken" 
    />
</p>
<h1 align="center">Peco</h1>
<p>
    The featherweight Deno webapp framework. Built with <a href="https://preactjs.com">Preact</a> and <a href="https://github.com/developit/htm">htm</a>.
</p>
<h2>Summary</h2>
<ul>
    <li>
        <strong>First-class frontend</strong> - server-side rendered then rapidly hydrated with no bulky external scripts.
    </li>
    <li>
        <strong>Production-ready backend</strong> - optimal performance with native Typescript and Redis page caching.
    </li>
    <li>
        <strong>Software minimalism</strong> - zero build-time technologies or bloated node_modules (${'<'}100MB Docker images).
    </li>
    <li>
        <strong>Ease of adoption</strong> - simple and familiar project structure and preconfigured deployment files.
    </li>
    <li>
        <strong>Uncompromised developer experience</strong> - CSS bundling, global state, hot-reloading and offline editing.
    </li>
</ul>
<p>
    All of this results in (P)ecological web applications. Read on, star/fork/clone away and feel free to contribute any ideas!
</p>

<h2>Getting started</h2>
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

<h2>How does it work?</h2>
<p>
    Deno http server receives page requests and renders Preact (+ htm) page components to HTML using <a href="https://github.com/preactjs/preact-render-to-string">preact-render-to-string</a>. The HTML is injected into an HTML template along with request metadata, CSS and a JavaScript module before being served to the user's browser client. In production mode the page render is also cached so subsequent requests can be served instantly until the pages cache lifetime is reached.
</p>
<p>
    The JavaScript module in the client hydrates the page with the page's source modules in development mode or an optimised <a href="https://deno.land/manual/tools/bundler">bundle</a> in production mode. To see this in action refresh the page and watch the last render time below.
</p>
<p><strong>Last render:</strong> ${new Date().toString()}</p>

<h2>Why is this cool?</h2>
<p>
    Because it provides all of the SEO and UX benefits of Server-Side Rendering (SSR) with no JavaScript transpilation or bundling required - the server and browser use the exact same code! This completely eliminates part of the traditional JavaScript SSR toolchain, increasing project maintainability and simplicity of development.
</p>
<p>
    It is all possible because of the unique combination of these powerful tools. Deno, unlike Node.js, is built to the <a href="https://tc39.es/">ECMAScript specification</a>. This makes it compatible with browser JavaScript and vice versa which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). Preact offers lightning fast client-side hydration and htm provides a transpiler-free JavaScript markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and a standard library full of great tools as well as a passionate community supporting it.
</p>

<h2>Differences between other frameworks like Next.js, etc.</h2>
<p>
    Peco is built with one radical design decision: it isn't built to support the npm/React universe. This is a deliberate step away from the inflated state that many modern web applications find themselves in.
</p>
<p>
    By using Preact and htm with no transpiler Peco bridges the gap between old and new, allowing the use of plain old HTML and CSS alongside JavaScript state management. This means you can utilise your favourite CSS libraries and HTML templates/snippets with no issue but you won't have access to the endless pool of community-made React components.
</p>