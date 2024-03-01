import { Router } from "../../index";
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

const server = Bun.serve({
  port: 7777,
  fetch(req) {
    return router.handle(req);
  },
});

console.log("Bun server running with Peko router <3");
console.log(await (await fetch("http://localhost:7777/")).json());

server.stop();
