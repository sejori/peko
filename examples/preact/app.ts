import Server from "../../mod.ts" // <- https://deno.land/x/peko/server.ts 

import config from "../config.ts"
import { pages, assets, APIs } from "./routes.ts"

// initialize server app
const server = new Server()

// custom config to 
server.setConfig(config)

// SSR'ed app page routes
pages.forEach(page => server.addRoute(page))

// Static assets
assets.forEach(asset => server.addRoute(asset))

// Custom API functions
APIs.forEach(API => server.addRoute(API))

// Start Peko server :)
server.listen()