import { HttpBaseRouter } from "../../lib/routers/httpBaseRouter.ts";
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1,
} from "./middleware.ts";

export const mockHttpBaseRouter = () => {
  const router = new HttpBaseRouter();
  router.addRoute(
    "/test",
    [testMiddleware1, testMiddleware2, testMiddleware3],
    testHandler
  );
  router.get("/bench", () => new Response("Hello, bench!"));
  return router;
};

