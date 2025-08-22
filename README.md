<p align="center" style="font-size: 72px;">
    <img 
        width="270px"
        style="margin: 1rem auto;"
        src="https://raw.githubusercontent.com/sejori/peko/main/examples/react/assets/twemoji_chick.svg" alt="peko-chick" 
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

const router = new Peko.HttpRouter();

router.use(Peko.logger(console.log));

router.GET("/shorthand-route", [], () => new Response("Hello world!"));

router.POST(
  "/shorthand-route-ext",
  [
    async (ctx, next) => {
      await next();
      console.log(ctx.request.headers);
    }
  ],
  (req) => new Response(req.body)
);

router.addRoute({
  path: "/object-route",
  method: "GET",
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

**Deno [Live Deploy](https://peko.deno.dev)**

- Process 1: `deno task dev:build`
- Process 2: `deno task dev:deno`

**Cloudflare Workers**

- `npm i`
- Process 1: `npm run dev:build`
- Process 2: `npm run dev:wrangler`

**Bun:**

- `bun install`
- Process 1: `bun dev:build`
- Process 2: `bun dev:bun`

Note: Runtimes are profiled against for speed - view the GitHub actions to see results.

<h2 id="examples">Examples</h2>

Check out the `examples` dir for React server-side rendering as well as an basic auth demo.

For a comprehensive product demo check out: https://panplan.ai - built entirely with Peko, React on Cloudflare Workers.

**Note:** [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) and [es6-string-css](https://marketplace.visualstudio.com/items?itemName=bashmish.es6-string-css) VS Code extensions recommended.

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
httoRouter.GET(
  "/get-time",
  [Peko.cache({ itemLifetime: 5000 })],
  () => new Response(Date.now())
);
```

The cacher stores response items in memory by default, but it can be extended to use any key value storage by supplying the `store` options parameter (e.g. Cloudflare Workers KV).

```js
import { HttpRouter, CacheItem, cache } from "@sejori/peko";

const router = new HttpRouter();
const itemMap: Map<string, CacheItem> = new Map();

router.GET(
  "/get-time", 
  [
    cache({
      itemLifetime: 5000,
      store: {
        get: (key) => itemMap.get(key),
        set: (key, value) => itemMap.set(key, value),
        delete: (key) => itemMap.delete(key),
      },
    })
  ],
  () => new Response(Date.now()),
);
```

<h2 id="motivations">Motivations</h2>

### Apps on the edge

The modern JavaScript edge rocks because the client-server gap practically disappears. We can share modules across the client and cloud.

This eliminates much of the bloat in traditional JS server-side systems, increasing project simplicity while making our software faster and more efficient.

This is made possible by engines such as Cloudflare Workers, Deno and Bun that are built to the [ECMAScript](https://tc39.es/) specification</a>.

If you are interested in contributing please submit a PR or get in contact ^^

### What does stateless mean?

Peko apps are designed to boot from scratch at request time and disappear once the request is served. Therefore, storing data in memory between requests (stateful logic) is not reliable. Instead we should use stateless logic and store data within the client or external services.

This paradigm is often referred to as "serverless" or "edge computing" on cloud platforms, which offer code execution on shared server hardware (a.k.a JavaScript isolates). This is [much more resource efficient](https://developer.ibm.com/blogs/the-future-is-serverless/) than traditional server provisioning.

Because stateless apps can "cold-start" it is important to keep their codebases small. The react demo app only imports Peko, react and Htm as dependencies and is very fast as a result - [https://peko.deno.dev](https://peko.deno.dev)!

**Note:** In reality a single app instance will serve multiple requests, we just can't guarantee it. This is why caching is still an effective optimization strategy but in-memory user sessions are not an effective authentication strategy.

## Credits:

Chick logo from [Twemoji](https://github.com/twitter/twemoji)
