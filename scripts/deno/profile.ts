import Profiler from "../../lib/utils/Profiler.ts";
import { getTestRouter } from "../../tests/mocks/middleware.ts";

const testRouter = getTestRouter();
const abortController = new AbortController();
Deno.serve(
  {
    port: 7778,
    signal: abortController.signal,
  },
  (req) => testRouter.handle(req)
);

const handleResults = await Profiler.run(testRouter, {
  mode: "handle",
  count: 100,
});
const serveResults = await Profiler.run(testRouter, {
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
