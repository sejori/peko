import { HttpRouter } from "../../lib/routers/httpRouter.ts";
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1,
} from "./middleware.ts";

export const testHttpRouter = () => {
  const router = new HttpRouter();
  router.addRoute(
    "/test",
    [testMiddleware1, testMiddleware2, testMiddleware3],
    testHandler
  );
  router.get("/bench", () => new Response("Hello, bench!"));
  return router;
};

