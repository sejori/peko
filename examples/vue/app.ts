import "./globals.ts" // <- extends window global for @vue/server-renderer

import PekoServer from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts

import config from "../config.ts"
import { pages, assets, APIs } from "./routes.ts"

const server = new PekoServer()

// Configure Peko
server.setConfig(config)
// SSR'ed app page routes
pages.forEach(page => server.addRoute(page))
// Static assets
assets.forEach(asset => server.addRoute(asset))
// Custom API functions
APIs.forEach(API => server.addRoute(API))

// Start your Peko server :)
server.listen()