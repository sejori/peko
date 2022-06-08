/**
 * Featherweight & Flexible Toolkit for Modern JS Apps. Built with Deno.
 */

// Core functions
export { start, addRoute, removeRoute } from "./lib/server.ts"
export { getConfig, setConfig } from "./lib/config.ts"

// Custom handlers and route adders
export { staticHandler, addStaticRoute } from "./lib/handlers/static.ts"
export { ssrHandler, addSSRRoute } from "./lib/handlers/ssr.ts"
export { sseHandler, addSSERoute } from "./lib/handlers/sse.ts"

// Utils
export { logRequest, logError } from "./lib/utils/logger.ts"
export { createResponseCache } from "./lib/utils/cacher.ts"
export { createEmitter } from "./lib/utils/emitter.ts"
export { hasher } from "./lib/utils/hasher.ts"
