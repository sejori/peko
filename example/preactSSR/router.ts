import {
  Router,
  RequestContext,
  logger,
  sse,
  cacher,
  ssr,
  file,
} from "../../mod.ts"; //"https://deno.land/x/peko/mod.ts"
import { renderToString } from "preact";

import Home from "./src/pages/Home.ts";
import About from "./src/pages/About.ts";
import htmlTemplate from "./document.ts";
import * as esbuild from "esbuild";

const router = new Router();
router.use(logger(console.log));

router.get("/", {
  middleware: cacher(),
  handler: (ctx) => {
    return ssr(
      () => {
        const ssrHTML = renderToString(Home(), null);
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

router.get(
  "/about",
  (ctx) => {
    ctx.state = {
      request_time: `${Date.now()}`,
      ...ctx.state.env,
    };
  },
  ssr((ctx) => {
    const ssrHTML = renderToString(About(ctx.state), null);
    return htmlTemplate({
      title: "Peko | About",
      ssrHTML,
      entrypoint: "/src/pages/About.ts",
    });
  })
);

// STATIC FILES
// dynamic URL param for filename, always cache
router.get("/assets/:filename", cacher(), async (ctx) =>
  (
    await file(
      new URL(
        `https://raw.githubusercontent.com/sejori/peko/main/example/preact/assets/${ctx.params.filename}`
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

// BUNDLED TS FILES
// dynamic URL param for filename, always cache
router.get("/src/:filename", cacher(), async (ctx) =>
  (
    await file(
      new URL(
        `https://raw.githubusercontent.com/sejori/peko/main/example/preact/src/${ctx.params.filename}`
      ),
      {
        transform: async (contents) => {
          const reader = contents.getReader();
          let result = "";
          let { done, value } = await reader.read();
          while (!done) {
            result += new TextDecoder().decode(value);
            ({ done, value } = await reader.read());
          }
          const esbuildResult = await esbuild.build({
            bundle: true,
            write: false,
            stdin: {
              contents: result,
            },
            format: "esm",
            target: "es2022",
            loader: {
              ".ts": "ts",
            },
          });

          const bundle = esbuildResult.outputFiles[0].text;
          console.log(bundle);
          return bundle;
        },
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
  )(ctx)
);

// API FUNCTIONALITY
const demoEventTarget = new EventTarget();
// shorthand route adding
router.get("/sse", (ctx: RequestContext) => {
  setInterval(() => {
    demoEventTarget.dispatchEvent(
      new CustomEvent("send", { detail: Math.random() })
    );
  }, 2500);

  return sse(demoEventTarget)(ctx);
});
// full route object adding
router.addRoute({
  path: "/api/parrot",
  method: "POST",
  handler: async (ctx: RequestContext) => {
    const body = await ctx.request.text();
    return new Response(`Parrot sqwarks: ${body}`);
  },
});

export default router;
