import "./globals.ts" // <- extends window global for @vue/server-renderer

import * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts

import config from "../config.ts"
import { pages, assets, APIs } from "./routes.ts"

// Configure Peko
Peko.setConfig(config)
// SSR'ed app page routes
pages.forEach(page => Peko.addSSRRoute(page))
// Static assets
assets.forEach(asset => Peko.addStaticRoute(asset))
// Custom API functions
APIs.forEach(API => Peko.addRoute(API))

// Start your Peko server :)
Peko.start()