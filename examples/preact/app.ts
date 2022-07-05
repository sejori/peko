import * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts

import config from "../config.ts"
import { pages, assets, APIs } from "./routes.ts"

const app = new Peko.PekoServer()

// Configure Peko
app.setConfig(config)
// SSR'ed app page routes
pages.forEach(page => app.addRoute(page))
// Static assets
assets.forEach(asset => app.addRoute(asset))
// Custom API functions
APIs.forEach(API => app.addRoute(API))

// Start Peko server :)
app.listen()