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

const handleResults = await Profiler.run(server, {
  count: 100
})

console.log("Profile results")
console.log("/test: " + handleResults["/test"].avgTime)
console.log("/bench: " + handleResults["/bench"].avgTime)