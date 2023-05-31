<h1>Peko library overview</h1>

<h2 id="app">App</h2>

The TypeScript `App.ts` module describes a small framework for managing routes and middleware for an HTTP server.

Here are the main components:

- **App class**: which manages your HTTP application routes and the middleware.
- **RequestContext class:** holds information about the app, the request, and state to be shared between middleware.

Main types (`types.ts`):

- **Route**: an object with path, method, middleware, and handler properties.
- **Middleware**: a function that receives a RequestContext and updates state or generates a response.
- **Handler**: a function that handles requests by receiving a RequestContext and generating a response.

The App class extends the Router class and has several methods for adding/removing routes and middleware, as well as handling requests:

- **use(middleware: Middleware | Middleware[] | Router)**: add global middleware or a router.
- **addRoute(route: Route)**: adds a route to the app.
- **addRoutes(routes: Route[])**: adds multiple routes to the app.
- **removeRoute(route: string)**: removes a route from the app.
- **removeRoutes(routes: string[])**: removes multiple routes from the app.
- **requestHandler(request: Request)**: generate a `Response` for the provided `Request` by creating a `RequestContext` and cascading it through middleware and route handler (if found).

<h2 id="routing">Routing</h2>

Routes can be added to an app instance directly or a Router instance. Below you can see the different ways routes can be added with `addRoute`.

```js
import { serve } from "https://deno.land/std/http/server.ts";
import * as Peko from "https://deno.land/x/peko/mod.ts"; 
// or import App from "https://deno.land/x/peko/App.ts"

const app = new Peko.App()
app.addRoute("/hello", () => new Response("Hello world!"))
app.removeRoute("/hello");

const router = new Peko.Router()

router.addRoute("/shorthand-route", async (ctx, next) => { await next(); console.log(ctx.request.headers); }, () => new Response("Hello world!"));

router.addRoute({
    path: "/object-route",
    middleware: async (ctx, next) => { 
        await next(); console.log(ctx.request.headers); 
    }, // can also be an array
    handler: () => new Response("Hello world!")
})

router.addRoutes([ /* array of route objects */ ])

app.use(router)

serve(req => app.requestHandler(req))
```

<h2 id="request-handling">Request handling</h2>

Each route must have a <code>handler</code> function that generates a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response). Upon receiving a request the `App.requestHandler` will construct a [RequestContext](https://deno.land/x/peko/lib/App.ts?s=RequestContext) and cascade it through any global middleware, then route middleware and finally the route handler. Global and route middleware are invoked in the order they are added. If a response is returned by any middleware along the chain no subsequent middleware/handler will run.

Peko comes with a library of utilities, middleware and handlers for common route use-cases, such as:
- server-side-rendering JS apps
- JWT signing/verifying & authentication
- logging
- caching
- WebSockets

See `handlers`, `middleware` or `utils` for source, or dive into `examples` for demo implementations. 

The second argument to any middleware is the `next` fcn. This returns a promise that resolves to the first response returned by any subsequent middleware/handler. This is useful for error-handling as well as post-response operations such as logging. See the below snippet or `middleware/logger.ts` for examples.

If no matching route is found for a request an empty 404 response is sent. If an error occurs in handling a request an empty 500 response is sent. Both of these behaviours can be overwritten with the following middleware:

```js
app.use(async (_, next) => {
    const response = await next();
    if (!response) return new Response("Would you look at that? Nothing's here!", { status: 404 });
});
```

```js
app.use(async (_, next) => {
    try {
        await next();
    } catch(e) {
        console.log(e);
        return new Response("Oh no! An error occured :(", { status: 500 });
    }
});
```

<h2 id="response-caching">Response caching</h2>

In stateless computing, memory should only be used for source code and disposable cache data. Response caching ensures that we only store data that can be regenerated or refetched. Peko provides a `ResponseCache` utility for this with configurable item lifetime. The `cacher` middleware wraps it and provides drop in handler memoization and response caching for your routes.

```js
const cache = new Peko.ResponseCache({ lifetime: 5000 });

app.addRoute("/do-stuff", Peko.cacher(cache), () => new Response(Date.now()));
```

And that's it! Check out the API docs for deeper info. Otherwise happy coding 🤓
