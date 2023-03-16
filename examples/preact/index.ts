import { Server, logger } from "../../mod.ts" // <- https://deno.land/x/peko/server.ts 
import pages from "./routes/pages.ts"
import assets from "./routes/assets.ts"
import APIs from "./routes/APIs.ts"

// initialize server
const server = new Server()
server.use(logger(console.log))

// SSR'ed app page routes
server.addRoutes(pages)

// Static assets
server.addRoutes(assets)

// Custom API functions
server.addRoutes(APIs)

// Start Peko server :^)
server.listen()