import Server from "../../server.ts" // <- https://deno.land/x/peko/server.ts 
import config from "../config.ts"
import pages from "./routes/pages.ts"
import assets from "./routes/assets.ts"
import APIs from "./routes/APIs.ts"

// initialize server with config
const server = new Server(config)

// SSR'ed app page routes
server.addRoutes(pages)

// Static assets
server.addRoutes(assets)

// Custom API functions
server.addRoutes(APIs)

// Start Peko server ^^
server.listen()