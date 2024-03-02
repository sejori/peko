import { Router } from "../../index.ts";
import {
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler,
} from "../mocks/middleware.ts";

const router = new Router();

router.get(
  "/",
  [testMiddleware1, testMiddleware2, testMiddleware3],
  testHandler
);

export default {
  fetch(request: Request) {
    return router.handle(request);
  },
} satisfies ExportedHandler;

console.log("Cloudflare Worker running with Peko router <3");
