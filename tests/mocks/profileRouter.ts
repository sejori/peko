import { Router } from "../../lib/Router.ts";
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1,
} from "./middleware.ts";

const router = new Router();
router.addRoute(
  "/test",
  [testMiddleware1, testMiddleware2, testMiddleware3],
  testHandler
);
router.get("/bench", () => new Response("Hello, bench!"));

export default router;
