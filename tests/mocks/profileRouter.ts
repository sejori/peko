import { HttpRouter } from "../../lib/routers/httpRouter.ts";
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1,
} from "./middleware.ts";

const router = new HttpRouter();
router.addRoute(
  "/test",
  [testMiddleware1, testMiddleware2, testMiddleware3],
  testHandler
);
router.get("/bench", () => new Response("Hello, bench!"));

export default router;
