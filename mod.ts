import { start, addRoute, addStaticRoute, addSSRRoute } from "./lib/server.ts"
import { getConfig, setConfig } from "./lib/config.ts"

// also provide handlers for custom implementations
import { ssrHandler, staticHandler } from "./lib/handlers/index.ts"


export default { start, addRoute, addStaticRoute, addSSRRoute, getConfig, setConfig, staticHandler, ssrHandler }
