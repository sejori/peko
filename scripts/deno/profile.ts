import Profile from "../../lib/core/utils/Profile.ts";
import { Router } from "../../lib/core/Router.ts";
import { 
  testMiddleware1, 
  testMiddleware2, 
  testMiddleware3, 
  testHandler 
} from "../../lib/core/_test/mocks/middleware.ts"

const testRouter = new Router();
testRouter.addRoute({
  path: "/test",
  method: "TEST",
  middleware: [
    testMiddleware1,
    testMiddleware2,
    testMiddleware3
  ],
  handler: testHandler
});
testRouter.addRoute({
  path: "/bench",
  method: "TEST",
  handler: () => new Response("Hello, bench!")
});

const abortController = new AbortController();
Deno.serve(
  {
    port: 7777,
    signal: abortController.signal,
  },
  (req) => testRouter.handle(req)
);

const handleResults = await Profile.run(testRouter, {
  mode: "handle",
  count: 100,
});
const serveResults = await Profile.run(testRouter, {
  mode: "serve",
  url: "http://localhost:7777",
  count: 100,
});

console.log("handle results");
console.log(`/test: ${handleResults["/test"].avgTime}ms`);
console.log(`/bench: ${handleResults["/bench"].avgTime}ms`);

console.log("serve results");
console.log(`/test: ${serveResults["/test"].avgTime}ms`);
console.log(`/bench: ${serveResults["/bench"].avgTime}ms`);

abortController.abort();
