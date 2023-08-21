import { Router } from "../../lib/Router.ts"
import Profiler from "../../lib/utils/Profiler.ts"
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1
} from "../mocks/middleware.ts"

const router = new Router()

router.addRoute("/test", [
  testMiddleware1,
  testMiddleware2,
  testMiddleware3
], testHandler)

router.get("/bench", () => new Response("Hello, bench!"))

const abortController = new AbortController()

Deno.serve({
  port: 7777,
  signal: abortController.signal
}, (req) => router.handle(req))

const handleResults = await Profiler.run(router, {
  mode: "handle",
  count: 100
})
const serveResults = await Profiler.run(router, {
  mode: "serve",
  url: "http://localhost:7777",
  count: 100
})

console.log("handle results")
console.log("/test: " + handleResults["/test"].avgTime)
console.log("/bench: " + handleResults["/bench"].avgTime)
console.log("serve results")
console.log("/test: " + serveResults["/test"].avgTime)
console.log("/bench: " + serveResults["/bench"].avgTime)

abortController.abort()