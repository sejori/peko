import { Router, logger } from "../../index"; //"https://deno.land/x/peko/mod.ts"
import pages from "./routes/pages.ts";
import assets from "./routes/assets.ts";
import APIs from "./routes/APIs.ts";

// initialize server
const router = new Router();
router.use(logger(console.log));

// SSR'ed app page routes
router.addRoutes(pages);

// Static assets
router.addRoutes(assets);

// Custom API functions
router.addRoutes(APIs);

// Start Deno server with Peko router :^)
Deno.serve((req) => router.handle(req));
