/**
 * The Featherweight Deno Library for Modern JS Apps.
 */

// Core functions
export { start } from "./lib/server.ts"
export { addRoute, addStaticRoute, addSSRRoute } from "./lib/routes.ts"
export { getConfig, setConfig } from "./lib/config.ts"

// Internals for custom handlers etc...
export { staticHandler } from "./lib/handlers/static.ts"
export { ssrHandler } from "./lib/handlers/ssr.ts"
export { logRequest } from "./lib/utils/logger.ts"
export { createResponseCache } from "./lib/utils/cacher.ts"
