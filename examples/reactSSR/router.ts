import { HttpRouter, log, cache } from "../../mod.ts"; //"https://deno.land/x/peko/mod.ts"
import { reactHandler } from "./handlers/react.handler.ts";
import { githubHandler } from "./handlers/github.handler.ts";
import { reqTime } from "./middleware/reqTime.middleware.ts";
import { randomEventHandler } from "./handlers/rdmEvent.handler.ts";
import { parrotHandler } from "./handlers/parrot.handler.ts";
import About from "./src/pages/About.tsx";
import Home from "./src/pages/Home.tsx";

const router = new HttpRouter();
router.use(log(console.log));

// SSR, with cache because static page
router.GET("/", [cache()], reactHandler(Home, "Peko", "/src/pages/Home.tsx"));

// SSR, no cache because dynamic content
router.GET(
  "/about",
  [reqTime],
  reactHandler(About, "Peko | About", "/src/pages/About.tsx")
);

// Static, URL param for filename, always cache
router.GET("/assets/:filename", [cache()], (ctx) =>
  githubHandler(`/assets/${ctx.params.filename}`)(ctx)
);

// Transformed src at build-time with esbuild, always cache
router.GET("/src/:dirname/:filename", [cache()], (ctx) =>
  githubHandler(
    `/dist/${ctx.params.dirname}/${ctx.params.filename.replace(".tsx", ".js")}`,
    "application/javascript"
  )(ctx)
);

// Server-sent events demo
router.GET("/sse", randomEventHandler);

// Basic
router.POST("/parrot", parrotHandler);

export default router;
