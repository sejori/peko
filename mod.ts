/**
 * Featherweight & Flexible Toolkit for Modern JS Apps. Built with Deno.
 */

// Core functions
export { start } from "./lib/server.ts"
export { addRoute, addStaticRoute, addSSRRoute, addSSERoute } from "./lib/routes.ts"
export { getConfig, setConfig } from "./lib/config.ts"

// Internals for custom handlers etc...
export { staticHandler } from "./lib/handlers/static.ts"
export { ssrHandler } from "./lib/handlers/ssr.ts"
export { sseHandler } from "./lib/handlers/sse.ts"
export { logRequest, logError } from "./lib/utils/logger.ts"
export { createResponseCache } from "./lib/utils/cacher.ts"
