<p align="center">
    <img 
        height="300px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sebringrose/peko/main/examples/preact/src/assets/logo_light_alpha.png" alt="peko-logo" 
    />
</p>

<p align="center">
    <span>
        &nbsp;
        <a href="#server">
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

<h2>Stateless HTTP(S) apps that are:</h2>

- <strong>Featherweight</strong> - Browser-native JavaScript + Deno std library + no build-time tooling

- <strong>Functional</strong> - [Express](https://github.com/expressjs/express)-like API + full-stack library

- <strong>Production-ready</strong> - High test coverage + stable Deno APIs + server profiling utility

- <strong>Community-driven</strong> - Popular tool integrations + contributions encouraged 

<h2>What does stateless mean?</h2>

Peko apps are designed to boot from scratch at request time and disappear once the request is served. Therefore, storing data in memory between requests (stateful logic) is not reliable. Instead we should use stateless logic and store data within the client or external services.

This paradigm is often referred to as "serverless" on cloud platforms, which offer cheap code execution on spare server capacity.

Because "serverless" apps cold-start it is important to keep the codebase small, hence Peko's focus on being featherweight. The preact demo app only imports Peko and Preact as external dependencies (and is very fast as a result)!

<strong>Note:</strong> In reality a single app instance will serve multiple requests, we just can't guarantee it. This is why caching is still an effective optimization strategy but in-memory user sessions are not an effective authentication strategy.

<h2>Try the Preact demo</h2>

1. Deno is sick. [Install it](https://deno.land/manual/getting_started/installation).</a>

2. `$ git clone https://github.com/sebringrose/peko.git`

3. `$ deno task start:dev`

<strong>Note: [Lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)</strong> VS Code plugin recommended.

<h2>Deployment</h2>

- [Deno Deploy](https://dash.deno.com/projects) (fork and deploy the examples if you fancy 💖)
- Docker (coming soon...)

<h2>App showcase</h2>

[iiisun.art](https://iiisun.art) - artistic storefront built with Deno, Peko, React, ImageMagick_deno [source](https://github.com/sebringrose/third-sun/blob/main/server.ts)

[shineponics.org](https://shineponics.org) - smart-farming PaaS built with Deno, Peko, React, Google Cloud Platform [source](https://github.com/shine-systems/shineponics/blob/main/server.ts)

[peko-auth.deno.dev](https://peko-auth.deno.dev) - demo app built with Deno, Peko, Preact [source](https://github.com/sebringrose/peko/blob/main/examples/auth/app.ts)

PR to add your project to the showcase 🙌

<h2>Core overview</h2>
<h3 id="server">Server</h3>

The TypeScript `server.ts` module describes a small framework for building HTTP servers on top of the Deno http/server module. 

Here are the main components:

- **Server class**: which manages the HTTP server, the routes, and the middleware.
- **RequestContext class:** holds information about the server, the request, and state to be shared between middleware.

Main types (`types.ts`):

- **Route**: an object with path, method, middleware, and handler properties.
- **Middleware**: a function that receives a RequestContext and updates state or generates a response.
- **Handler**: a function that handles requests by receiving a RequestContext and generating a response.

The Server class has several methods for adding and removing routes and middleware, as well as starting the server and handling requests:

- **use(middleware: Middleware | Middleware[] | Router)**: add global middleware or a router.
- **addRoute(route: Route)**: adds a route to the server.
- **addRoutes(routes: Route[])**: adds multiple routes to the server.
- **removeRoute(route: string)**: removes a route from the server.
- **removeRoutes(routes: string[])**: removes multiple routes from the server.
- **listen(port?: number, onListen?: callback)**: starts listening to HTTP requests on the specified port.
- **close()**: stops to HTTP listener process.

```js
import * as Peko from "https://deno.land/x/peko/mod.ts"; // or "../server.ts" for super featherweight 

const server = new Peko.Server();

server.use(Peko.logger(console.log));

server.addRoute("/hello", () => new Response("Hello world!"));

server.listen(7777, () => console.log("Peko server started - let's go!"));
```

<h3 id="routing">Routing</h3>

Routes can be added to a Server instance directly or a Router instance. Below you can see the different ways routes can be added with `addRoute`.

```js
import * as Peko from "https://deno.land/x/peko/mod.ts"; // or "https://deno.land/x/peko/server.ts"

const server = new Peko.Server()
server.addRoute("/hello", () => new Response("Hello world!"))
server.removeRoute("/hello");

const router = new Peko.Router()

router.addRoute("/shorthand-route", async (ctx, next) => { await next(); console.log(ctx.request.headers); }, () => new Response("Hello world!"));

router.addRoute({
    path: "/object-route",
    middleware: async (ctx, next) => { await next(); console.log(ctx.request.headers); }, // can also be array of middleware
    handler: () => new Response("Hello world!")
})

router.addRoutes([ /* array of route objects */ ])

server.use(router)

server.listen()
```

<h3 id="request-handling">Request handling</h3>

Each route must have a <code>handler</code> function that generates a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response). Upon receiving a request the `Server` will construct a [RequestContext](https://deno.land/x/peko/server.ts?s=RequestContext) and cascade it through any global middleware, then route middleware and finally the route handler. Global and route middleware are invoked in the order they are added. If a response is returned by any middleware along the chain no subsequent middleware/handler will run.

Peko comes with a library of utilities, middleware and handlers for common route use-cases, such as:
- server-side-rendering
- opening WebSockets
- JWT signing/verifying & authentication
- logging
- caching

See `handlers`, `mmiddleware` or `utils` for source, or dive into `examples` for demo implementations. 

The second argument to any middleware is the `next` fcn. This returns a promise that resolves to the first response returned by any subsequent middleware/handler. This is useful for error-handling as well as post-response operations such as logging. See the below snippet or `middleware/logger.ts` for examples.

If no matching route is found for a request an empty 404 response is sent. If an error occurs in handling a request an empty 500 response is sent. Both of these behaviours can be overwritten with the following middleware:

```js
server.use(async (_, next) => {
    const response = await next();
    if (!response) return new Response("Would you look at that? Nothing's here!", { status: 404 });
});
```

```js
server.use(async (_, next) => {
    try {
        await next();
    } catch(e) {
        console.log(e);
        return new Response("Oh no! An error occured :(", { status: 500 });
    }
});
```

<h3 id="response-caching">Response caching</h3>

In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. Peko provides a `ResponseCache` utility for this with configurable item lifetime. The `cacher` middleware wraps it and provides drop in handler memoization and response caching for your routes.

```js
const cache = new Peko.ResponseCache({ lifetime: 5000 });

server.addRoute("/do-stuff", Peko.cacher(cache), () => new Response(Date.now()));
```

And that's it! Check out the API docs for deeper info. Otherwise happy coding 🤓

<h2 id="cool">Motivations</h2>

The modern JS edge is great because the client-server gap practically disappears. We can have all of the SEO and UX benefits of SSR without any JavaScript transpilation or bundling. We can use modules and classes in the browser until users decide they want cloud compute. If we want TS source we can [emit](https://github.com/denoland/deno_emit) JS versions of code. This completely eliminates part of the traditional JavaScript toolchain, increasing project maintainability and simplicity, all while making our software even faster.

Better yet, Peko is not build for any specific frontend framework or library. You can use barebones HTML, React, Preact, Vue... you name it. Simply plug your app-rendering logic into the [Render](https://deno.land/x/peko@v1.0.0/handlers/ssr.ts?s=Render) function of an [ssrHandler](https://doc.deno.land/https://deno.land/x/peko/lib/handlers/ssr.ts).

This is all made possible by modern JavaScript runtimes. Deno is built to the [ECMAScript](https://tc39.es/) specification</a>. This makes it compatible with browser JavaScript which elimates the need to generate separate client and server JavaScript bundles (the support for URL imports is the secret sauce). UI libraries like [Preact](https://github.com/preactjs/preact) combined with [htm](https://github.com/developit/htm) offer lightning fast client-side hydration with a browser-friendly markup syntax. On top of this Deno has native TypeScript support, a rich runtime API and loads of community tools for your back-end needs.

This project started out of excitement for the elegancy of Deno and the freedom it would bring to the JavaScript community. If you are interested in contributing please submit a PR or get in contact ^^
