import {
  Router,
  RequestContext,
  logger,
  sse,
  cacher,
  ssr,
  file,
} from "../../mod.ts"; //"https://deno.land/x/peko/mod.ts"
import { renderToString } from "preact-render-to-string";

import Home from "./src/pages/Home.ts";
import About from "./src/pages/About.ts";
import htmlTemplate from "./document.ts";

const router = new Router();
router.use(logger(console.log));

// SSR example, with cache bc static page
router.get("/", {
  middleware: cacher(),
  handler: (ctx) => {
    return ssr(
      () => {
        const ssrHTML = renderToString(Home(), null, null);
        return htmlTemplate({
          title: "Peko",
          ssrHTML,
          entrypoint: "/src/pages/Home.ts",
        });
      },
      {
        headers: new Headers({
          // instruct browser to cache page in prod env
          "Cache-Control":
            ctx.state.env.ENVIRONMENT === "production"
              ? "max-age=86400, stale-while-revalidate=86400"
              : "no-store",
        }),
      }
    )(ctx);
  },
});

// SSR example, no cache because dynamic content
// (About page renders server state into HTML)
router.get(
  "/about",
  (ctx) => {
    ctx.state = {
      request_time: `${Date.now()}`,
      ...ctx.state.env,
    };
  },
  ssr((ctx) => {
    const ssrHTML = renderToString(About(ctx.state), null, null);
    return htmlTemplate({
      title: "Peko | About",
      ssrHTML,
      entrypoint: "/src/pages/About.ts",
      serverState: ctx.state,
    });
  })
);

// Static file example
// dynamic URL param for filename, always cache
router.get("/assets/:filename", cacher(), async (ctx) =>
  (
    await file(
      new URL(
        `https://raw.githubusercontent.com/sejori/peko/main/example/preactSSR/assets/${ctx.params.filename}`
      ),
      {
        headers: new Headers({
          // instruct browser to cache file in prod env
          "Cache-Control":
            ctx.state.env.ENVIRONMENT === "production"
              ? "max-age=86400, stale-while-revalidate=86400"
              : "no-store",
        }),
      }
    )
  )(ctx)
);

// Return transformed source code example
// dynamic URL param for filename, always cache, transformed with esbuild at build time
router.get("/src/:dirname/:filename", cacher(), async (ctx) => {
  const transformedFilename = ctx.params.filename.replace(".ts", ".js");
  return (
    await file(
      new URL(
        `https://raw.githubusercontent.com/sejori/peko/main/example/preactSSR/dist/${ctx.params.dirname}/${transformedFilename}`
      ),
      {
        headers: new Headers({
          "Content-Type": "application/javascript",
          // instruct browser to cache file in prod env
          "Cache-Control":
            ctx.state.env.ENVIRONMENT === "production"
              ? "max-age=86400, stale-while-revalidate=86400"
              : "no-store",
        }),
      }
    )
  )(ctx);
});

// Server-sent events example
const demoEventTarget = new EventTarget();
router.get("/sse", (ctx: RequestContext) => {
  setInterval(() => {
    demoEventTarget.dispatchEvent(
      new CustomEvent("send", { detail: Math.random() })
    );
  }, 2500);

  return sse(demoEventTarget)(ctx);
});

// .addRoute example
router.addRoute({
  path: "/api/parrot",
  method: "POST",
  handler: async (ctx: RequestContext) => {
    const body = await ctx.request.text();
    return new Response(`Parrot sqwarks: ${body}`);
  },
});

export default router;
