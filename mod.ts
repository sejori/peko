/**
 * Featherweight & Flexible Toolkit for Modern JS Apps. Built with Deno.
 */

// Core functions
export { start, addRoute } from "./lib/server.ts"
export { getConfig, setConfig } from "./lib/config.ts"

// Custom handlers and utils etc...
export { staticHandler, addStaticRoute } from "./lib/handlers/static.ts"
export { ssrHandler, addSSRRoute } from "./lib/handlers/ssr.ts"
export { sseHandler, addSSERoute } from "./lib/handlers/sse.ts"
export { logRequest, logError } from "./lib/utils/logger.ts"
export { createResponseCache } from "./lib/utils/cacher.ts"
