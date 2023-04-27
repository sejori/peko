import { Server } from "../../lib/Server.ts"
import {
  testMiddleware2,
  testMiddleware3,
  testHandler,
  testMiddleware1
} from "../mocks/middleware.ts"
import Profiler from "../../lib/utils/Profiler.ts"

const server = new Server()

server.addRoute("/test", [
  testMiddleware1,
  testMiddleware2,
  testMiddleware3
], testHandler)

server.addRoute("/bench", () => new Response("Hello, bench!"))

server.listen(8000, () => {})

const handleResults = await Profiler.run(server, {
  mode: "handle",
  count: 100
})
const serveResults = await Profiler.run(server, {
  mode: "serve",
  count: 100
})

console.log("handle results")
console.log("/test: " + handleResults["/test"].avgTime)
console.log("/bench: " + handleResults["/bench"].avgTime)
console.log("serve results")
console.log("/test: " + serveResults["/test"].avgTime)
console.log("/bench: " + serveResults["/bench"].avgTime)

server.close()