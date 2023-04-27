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
        <a href="https://github.com/sebringrose/peko/blob/main/overview.md#server">
            Server
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="https://github.com/sebringrose/peko/blob/main/overview.md#routing">
            Routing
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="https://github.com/sebringrose/peko/blob/main/overview.md#request-handling">
            Request handling
        </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
        <a href="https://github.com/sebringrose/peko/blob/main/overview.md#response-caching">
            Response caching
        </a>
        &nbsp;
    </span>
</p>

<p align="center">
    <span>
        &nbsp;
            <a href="https://doc.deno.land/https://deno.land/x/peko/mod.ts">
                API DOCS
            </a>
        &nbsp;
    </span>
    <span>
        &nbsp;
            <a href="https://github.com/sebringrose/pekommunity">
                COMMUNITY TOOLS
            </a>
        &nbsp;
    </span>
</p>

<h1>Stateless HTTP(S) apps that are:</h1>

- <strong>Featherweight</strong> - Browser-native JavaScript + Deno std library

- <strong>Functional</strong> - [Express](https://github.com/expressjs/express)-like API + full-stack tooling

- <strong>Production-ready</strong> - High test coverage + stable APIs + server profiling

- <strong>Community-driven</strong> - Popular tool integrations + contributions encouraged 

<h2>Getting started</h2>

```js
import * as Peko from "https://deno.land/x/peko/mod.ts"; 
// import from ".../peko/lib/Server.ts" for featherweight mode

const server = new Peko.Server();

server.use(Peko.logger(console.log));

server.get("/hello", () => new Response("Hello world!"));

server.listen(7777, () => console.log("Peko server started - let's go!"));
```

<h2>App showcase</h2>

PR to add your project 🙌

### [iiisun.art](https://iiisun.art) - artistic storefront 
- **Stack:** React, ImageMagick_deno
- **Features:** CI resized-image precaching, Gelato & Stripe integrations, Parallax CSS
- [source](https://github.com/sebringrose/third-sun/blob/main/server.ts)

### [shineponics.org](https://shineponics.org) - smart-farming PaaS 
- **Stack:** React, Google Cloud Platform
- **Features:** Google Sheet analytics, GCP email list, Markdown rendering
- [source](https://github.com/shine-systems/shineponics/blob/main/server.ts)

### [peko-auth.deno.dev](https://peko-auth.deno.dev) - basic authentication demo 
- **Stack:** HTML5
- **Features:** JWT-based auth
- [source](https://github.com/sebringrose/peko/blob/main/examples/auth/app.ts)

**Note:** [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) and [es6-string-css](https://marketplace.visualstudio.com/items?itemName=bashmish.es6-string-css) VS Code extensions recommended.

<h2>Deployment</h2>

- [Deno Deploy](https://dash.deno.com/projects) (fork and deploy the examples if you fancy 💖)
- Docker (coming soon...)

<h2>What does stateless mean?</h2>

Peko apps are designed to boot from scratch at request time and disappear once the request is served. Therefore, storing data in memory between requests (stateful logic) is not reliable. Instead we should use stateless logic and store data within the client or external services.

This paradigm is often referred to as "serverless" or "edge computing" on cloud platforms, which offer code execution on shared server hardware. This is [much more resource efficient](https://developer.ibm.com/blogs/the-future-is-serverless/) than traditional server provisioning.

Because our stateless apps cold-start it is important to keep their codebases small. The preact demo app only imports Peko and Preact as external dependencies and is very fast as a result - [https://peko.deno.dev](https://peko.deno.dev)!

<strong>Note:</strong> In reality a single app instance will serve multiple requests, we just can't guarantee it. This is why caching is still an effective optimization strategy but in-memory user sessions are not an effective authentication strategy.

<h2 id="cool">Motivations</h2>

The modern JavaScript edge rocks because the client-server gap practically disappears. We can share modules across the client and cloud. If we want TS source we can [emit](https://github.com/denoland/deno_emit) JS. This eliminates much of the bloat in traditional JS server-side systems, increasing project simplicity while making our software faster and more efficient.

This is made possible by engines such as Deno that are built to the [ECMAScript](https://tc39.es/) specification</a> (support for URL module imports is the secret sauce). UI libraries like [Preact](https://github.com/preactjs/preact) combined with [htm](https://github.com/developit/htm) offer lightning fast client-side hydration with a browser-friendly markup syntax. Deno also has native TypeScript support, a rich runtime API and loads of community tools for your back-end needs.

If you are interested in contributing please submit a PR or get in contact ^^

Read `overview.md` for a more detailed guide on using Peko.
