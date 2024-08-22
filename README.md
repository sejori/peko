<p align="center" style="font-size: 72px;">
    <img 
        width="270px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sejori/peko/main/example/reactSSR/assets/twemoji_chick.svg" alt="peko-chick" 
    />
</p>

<h1 align="center">
    Peko
</h1>

<p align="center">
    <strong>Fast</strong> - Regex route matching and caching with Node, Deno, Bun & Cloudflare Worker support 🏎️💨
</p>
<p align="center">
    <strong>Featherweight</strong> - Functional API built with Web Standards & zero dependencies 🪶<br>
</p>
<p align="center">
    <strong>Feature-rich</strong> - Static files, auth, server-sent events & server profiling utils 🤹
</p>

<p align="center">
    <span>
        &nbsp;
        <a href="#overview">
            Overview
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="#getting-started">
            Getting Started
        </a>
        &nbsp;
    </span>
        <span>
        &nbsp;
        <a href="#recipes">
            Recipes
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="#motivations">
            Motivations
        </a>
        &nbsp;
    </span>
</p>

```bash
npm i @sejori/peko
```

<h2 id="overview">Overview</h2>

Routes and middleware are added to a `Router` instance with `.use`, `.addRoute` or `.get/post/put/delete`.

The router is then used with your web server of choice, e.g. `Deno.serve` or `Bun.serve`.


```js
import * as Peko from "@sejori/peko"; // or https://deno.land/x/peko/mod.ts in Deno

const router = new Peko.Router();

router.use(Peko.logger(console.log));

router.get("/shorthand-route", () => new Response("Hello world!"));

router.post(
  "/shorthand-route-ext",
  async (ctx, next) => {
    await next();
    console.log(ctx.request.headers);
  },
  (req) => new Response(req.body)
);

router.addRoute({
  path: "/object-route",
  middleware: async (ctx, next) => {
    await next();
    console.log(ctx.request.headers);
  }, // can also be array of middleware
  handler: () => new Response("Hello world!"),
});

router.addRoutes([
  /* array of route objects */
]);

Deno.serve((req) => router.handle(req));
```

<h2 id="getting-started">Getting started</h2>

- `git clone https://github.com/sejori/peko` && `cd peko`

Check `example` directory to see implementations of:

- server-side rendering Preact to HTML
- streaming server-sent events to web client
- logging requests
- caching responses
- JWT authentication middleware

**Deno [Live Deploy](https://peko.deno.dev)**

- Process 1: `deno task dev:build`
- Process 2: `deno task dev:deno`

**Cloudflare Workers [Live Deploy](https://peko.sejori.workers.dev)**

- `npm i`
- Process 1: `npm run dev:build`
- Process 2: `npm run dev:wrangler`

**Bun:**
Bun is currently not deployed but it is profiled against Deno, check the GitHub actions to see results.

- `bun install`
- Process 1: `bun dev:build`
- Process 2: `bun dev:bun`

<h2 id="types">Types</h2>

### [**Router**](https://deno.land/x/peko/mod.ts?s=Router)

The main class/entrypoint of Peko.

The `handle` method generates a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) from a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) argument via configured routes and middleware.

### [**Route**](https://deno.land/x/peko/mod.ts?s=Route)

Routes are added to a `Router` and matched to a `Request` via their `path` property. Once matched, the route's `middleware` and `handlers` are invoked to process the `Request` (after global middleware on the `Router`).

Dynamic path parameters are supported in the `/users/:userid` syntax.

### [**RequestContext**](https://deno.land/x/peko/mod.ts?s=RequestContext)

An object containing request data that is passed into middleware and handlers in the `Request` process lifecycle.

The `state` property is an object designed to transfer information between middleware/handlers.

### [**Middleware**](https://deno.land/x/peko/mod.ts?s=Middleware)

Functions that receive `RequestContext` and `next`. They are designed to:

- Return a `Response` and end the `Request` processing lifecycle (e.g. returning a `401`)
- Call `await next()` to access the final response (e.g. logging)
- Edit the context's `state` (e.g. rendering geolocation to HTML)

### [**Handler**](https://deno.land/x/peko/mod.ts?s=Handler)

The final request handling function on a `Route`, receives `RequestContext` argument.

Must return/resolve to a `Response` (e.g. Render HTML or return JSON payload).

<h2 id="recipes">Recipes</h2>

### Error handling

If no matching route is found for a request an empty 404 response is sent. If an error occurs in handling a request an empty 500 response is sent. Both of these behaviours can be overwritten with the following middleware:

```js
router.use(async (_, next) => {
  const response = await next();
  if (!response)
    return new Response("Would you look at that? Nothing's here!", {
      status: 404,
    });
});
```

```js
router.use(async (_, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    return new Response("Oh no! An error occured :(", { status: 500 });
  }
});
```

### Response Caching

In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. The configurable `cacher` middleware provides drop in handler memoization and response caching for your routes.

```js
router.addRoute(
  "/get-time",
  Peko.cacher({ itemLifetime: 5000 }),
  () => new Response(Date.now())
);
```

The cacher stores response items in memory by default, but it can be extended to use any key value storage by supplying the `store` options parameter (e.g. Cloudflare Workers KV).

```js
import { Router, CacheItem, cacher } from "@sejori/peko";

const router = new Router();

const itemMap: Map<string, CacheItem> = new Map();

router.addRoute("/get-time", {
  middleware: cacher({
    itemLifetime: 5000,
    store: {
      get: (key) => itemMap.get(key),
      set: (key, value) => itemMap.set(key, value),
      delete: (key) => itemMap.delete(key),
    },
  }),
  handler: () => new Response(Date.now()),
});
```

<h2 id="showcase">Showcase</h2>

PR to add your project 🙌

### [shineon.systems](https://shineon.systems)

- **Stack:** React, Cloudflare Workers, KV and R2
- **Features:** KV cache, R2 email list, Markdown rendering
- [source](https://github.com/shine-systems/shineponics/blob/main/server.ts)

### [thesebsite.deno.dev](https://thesebsite.deno.dev)

- **Stack:** HTML5
- **Features:** UI TS scripts transpiled to JS and cached for browser
- [source](https://github.com/sebringrose/peko/blob/main/examples/auth/app.ts)

**Note:** [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) and [es6-string-css](https://marketplace.visualstudio.com/items?itemName=bashmish.es6-string-css) VS Code extensions recommended.

<h2 id="motivations">Motivations</h2>

### Apps on the edge

The modern JavaScript edge rocks because the client-server gap practically disappears. We can share modules across the client and cloud.

This eliminates much of the bloat in traditional JS server-side systems, increasing project simplicity while making our software faster and more efficient.

This is made possible by engines such as Cloudflare Workers, Deno and Bun that are built to the [ECMAScript](https://tc39.es/) specification</a>.

If you are interested in contributing please submit a PR or get in contact ^^

### What does stateless mean?

Peko apps are designed to boot from scratch at request time and disappear once the request is served. Therefore, storing data in memory between requests (stateful logic) is not reliable. Instead we should use stateless logic and store data within the client or external services.

This paradigm is often referred to as "serverless" or "edge computing" on cloud platforms, which offer code execution on shared server hardware (a.k.a JavaScript isolates). This is [much more resource efficient](https://developer.ibm.com/blogs/the-future-is-serverless/) than traditional server provisioning.

Because stateless apps can "cold-start" it is important to keep their codebases small. The preact demo app only imports Peko, Preact and Htm as dependencies and is very fast as a result - [https://peko.deno.dev](https://peko.deno.dev)!

**Note:** In reality a single app instance will serve multiple requests, we just can't guarantee it. This is why caching is still an effective optimization strategy but in-memory user sessions are not an effective authentication strategy.

## Credits:

Chick logo from [Twemoji](https://github.com/twitter/twemoji)
