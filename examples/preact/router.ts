import { Router, logger } from "../../index.ts"; //"https://deno.land/x/peko/mod.ts"
import pages from "./routes/pages.ts";
import APIs from "./routes/APIs.ts";

// initialize server
const router = new Router();
router.use(logger(console.log));

// SSR'ed app page routes
router.addRoutes(pages);

// Custom API functions
router.addRoutes(APIs);

export default router;
