import Profiler from "../../lib/utils/Profiler.ts";
import { testHttpRouter } from "../../tests/mocks/httpRouter.ts";

const testRouter = testHttpRouter();

const handleResults = await Profiler.run(testRouter, {
  mode: "handle",
  count: 100,
});
const serveResults = await Profiler.run(testRouter, {
  mode: "serve",
  url: "http://localhost:8787",
  count: 100,
});

console.log("handle results");
console.log(`/test: ${handleResults["/test"].avgTime}ms`);
console.log(`/bench: ${handleResults["/bench"].avgTime}ms`);

console.log("serve results");
console.log(`/test: ${serveResults["/test"].avgTime}ms`);
console.log(`/bench: ${serveResults["/bench"].avgTime}ms`);
