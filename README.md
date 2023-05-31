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
        <a href="https://github.com/sebringrose/peko/blob/main/overview.md#app">
            App
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

- <strong>Featherweight</strong> - Designed for optimal cold-starts in serverless cloud environments
- <strong>Cross-platform</strong> - Utilises browser-native JS and node/fs APIs supported by many engines
- <strong>Functional</strong> - [Express](https://github.com/expressjs/express)-like API with library of middleware, handlers and utils
- <strong>Production-ready</strong> - Fully-tested TypeScript source-code + application profiling utility


<h2>Getting started</h2>

```js
import { serve } from "https://deno.land/std/http/server.ts";
import * as Peko from "https://deno.land/x/peko/mod.ts"; 
// or import App from ".../peko/lib/App.ts"

const app = new Peko.App();

server.use(Peko.logger(console.log));

server.get("/hello", () => new Response("Hello world!"));

serve(req => app.requestHandler(req));
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

Because our stateless apps cold-start it is important to keep their codebases small. The react demo app only imports Peko and React as external dependencies and is very fast as a result - [https://peko.deno.dev](https://peko.deno.dev)!

<strong>Note:</strong> In reality a single app instance will serve multiple requests, we just can't guarantee it. This is why caching is still an effective optimization strategy but in-memory user sessions are not an effective authentication strategy.

<h2 id="cool">Motivations</h2>

The modern JavaScript edge rocks because the client-server gap practically disappears. We can share modules across the client and cloud. This eliminates much of the bloat in traditional JS server-side systems, increasing project simplicity while making our software faster and more efficient.

This is made possible by engines such as Deno and Bun that are built to the [ECMAScript](https://tc39.es/) specification</a> (support for URL module imports is the secret sauce).

If you are interested in contributing please submit a PR or get in contact ^^

Read `overview.md` for a more detailed guide on using Peko.
