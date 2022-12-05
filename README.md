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

- <strong>Client-edge synergy</strong> - Share modules for server rendering, consistent data and easy maintenance.

- <strong>Production-ready backend</strong> - Cascading middlware, auth utils and more, all tested.

- <strong>Software minimalism</strong> - Built with native JS APIs and [Deno std library](https://deno.land/std) only.

- <strong>Ease of adoption</strong> - Intuitive "[Express](https://github.com/expressjs/express)-like" API with no file-system routing.

Any feature suggestions or code reviews are very welcome!

<h2>Examples</h2>

[A secure and scalable webapp in one file 🧑‍💻🌠](https://github.com/sebringrose/peko/blob/main/examples/auth/app.ts)

<h3>Try locally:</h3>

1. Deno is sick. [Install it](https://deno.land/manual/getting_started/installation).</a>

2. `$ git clone https://github.com/sebringrose/peko.git`

3. `$ deno task start:dev`

<strong>Note: [Lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)</strong> VS Code plugin recommended if using HTM & Preact.

<h2>Deployment</h2>

Instantly deploy from GitHub with [Deno Deploy](https://dash.deno.com/projects) (fork and deploy the examples if you fancy 💖).

<h2>Overview</h2>
<h3 id="#server">Server</h3>

The [Server](https://deno.land/x/peko/server.ts)</a> is the main class of Peko. It wraps Deno's [std/serve](<a href="https://deno.land/std/http/server.ts">) and holds all route and middleware data for request handling. `Server.use` can be used to add global middleware like the popular Express and Koa frameworks.

```
import * as Peko from "https://deno.land/x/peko/mod.ts"; // or "https://deno.land/x/peko/server.ts"

const server = new Peko.Server();

server.use(Peko.logger(console.log));

server.addRoute("/hello", () => new Response("Hello world!"));

server.listen(7777, () => console.log("Peko server started - let's go!"));
```

<h3 id="#routing">Routing</h3>

Requests are matched to a mutable array of [Routes](https://doc.deno.land/https://deno.land/x/peko/server.ts/~/Route">). Routes are added and configured with their own middleware and handlers via the `addRoute`, `addRoutes`, `removeRoute` or `removeRoutes` server methods.

```
server.addRoute("/hello-log-headers", async (ctx, next) => { await next(); console.log(ctx.request.headers); }, () => new Response("Hello world!"));

server.addRoute({
    route: "/hello-object-log-headers",
    middleware: async (ctx, next) => { await next(); console.log(ctx.request.headers); }, // could also be an array of middleware
    handler: () => new Response("Hello world!")
});

server.addRoutes([ /* array of route objects */ ]);

server.removeRoute("/hello-log-headers");
```

<h3 id="request-handling">Request handling</h3>

Each route must have a <code>handler</code> function that generates a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response). The `server.requestHandler` will execute global middleware in the order they were added first, then route middleware (in order) and then the route handler. If a Response is returned by any middleware along the way it will be sent the client and no subsequent middleware/handler will run.

After responding the server will cascade the RequestContext back through previously called middleware that implement `await next()`. If no matching route is found for a request an empty 404 response is sent. If an error occurs in handling a request an empty 500 response is sent. Both of these behaviours can be overwritten with the following middleware:

```
server.use(ctx => {
    if (!ctx.response) return new Response("...", { status: 404 })
})
```

```
server.use(async (ctx, next) => {
    try {
        await next()
    } catch(e) {
        console.log(e)
        return new Response("...", { status: 500 })
    }
})
```

The included `staticHandler`, `ssrHandler` and `sseHandler` handlers can be plugged straight into routes and reduce boilerplate code for serving static assets, rendering client-side apps and streaming [CustomEvents](https://developer.mozilla.org/docs/Web/API/CustomEvent/CustomEvent) for server-sent events respectively (see `/examples` for implementations). There are also authentication, logging and caching middleware. Of course, you can also create your own middleware or handlers and plug them into your routes.

<h3 id="response-caching">Response caching</h3>

In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. Peko provides a `ResponseCache` utility for this with configurable item lifetime. The `cacher` middleware wraps it and provides drop in handler memoization and response caching for your routes.

```
const cache = new Peko.ResponseCache({ lifetime: 5000; });

server.addRoute("/do-stuff", Peko.cacher(cache), () => new Response(Date.now()));
```

<h2 id="cool">The modern edge is cool because...</h2>

The client-server gap practically disappears. We can have all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling. We can use modules and classes in the browser until users decide they want cloud compute. If we want TS source we can [emit](https://github.com/denoland/deno_emit) JS versions of code. This completely eliminates part of the traditional JavaScript toolchain, increasing project maintainability and simplicity, all while making our software even faster.

Better yet, Peko is not build for any specific frontend framework or library. You can use barebones HTML, React, Preact, Vue... you name it (if you do set up a React or Vue project please consider opening a PR to the examples). Simply plug your app-rendering logic into the [Render](https://deno.land/x/peko@v1.0.0/handlers/ssr.ts?s=Render) function of an [ssrHandler](https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts).

This is all made possible by powerful new JavaScript tools. Deno is built to the [ECMAScript](https://tc39.es/) specification</a>. This makes it compatible with browser JavaScript which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like [Preact](https://github.com/preactjs/preact) combined with [htm](https://github.com/developit/htm) offer lightning fast client-side hydration with a browser-friendly markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and loads of community tools for your back-end needs.

This project started out of excitement for the elegancy of Deno and the freedom it would bring to the JavaScript community. If you are interested in contributing please submit a PR or get in contact :D
