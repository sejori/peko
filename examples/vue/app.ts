import "./globals.ts" // <- extends window global for @vue/server-renderer

import { Server, logger } from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import { pages, assets, APIs } from "./routes.ts"

// initialize server
const server = new Server()
server.use(logger)

// SSR'ed app page routes
server.addRoutes(pages)

// Static assets
server.addRoutes(assets)

// Custom API functions
server.addRoutes(APIs)

// Start Peko server ^^
server.listen()